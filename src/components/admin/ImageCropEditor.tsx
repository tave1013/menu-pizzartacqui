import { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageCropEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onApply: (croppedImageUrl: string) => void;
}

// TODO: For future integration with storage services (S3, Supabase Storage)
// The cropped image is currently returned as base64
// Replace the base64 output with an upload call to your storage service

export function ImageCropEditor({ open, onOpenChange, imageUrl, onApply }: ImageCropEditorProps) {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const ASPECT_RATIO = 4 / 3;
  const OUTPUT_WIDTH = 1200;
  const OUTPUT_HEIGHT = OUTPUT_WIDTH / ASPECT_RATIO;

  useEffect(() => {
    if (open && imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageRef.current = img;
        setImageLoaded(true);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      };
      img.src = imageUrl;
    }
    return () => {
      setImageLoaded(false);
    };
  }, [open, imageUrl]);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleApply = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;

    const img = imageRef.current;
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Calculate how the image is displayed
    const imgAspect = img.width / img.height;
    let displayWidth: number, displayHeight: number;
    
    if (imgAspect > ASPECT_RATIO) {
      displayHeight = containerHeight * zoom;
      displayWidth = displayHeight * imgAspect;
    } else {
      displayWidth = containerWidth * zoom;
      displayHeight = displayWidth / imgAspect;
    }

    // Calculate source coordinates from the original image
    const scaleX = img.width / displayWidth;
    const scaleY = img.height / displayHeight;

    const offsetX = (displayWidth - containerWidth) / 2 - position.x;
    const offsetY = (displayHeight - containerHeight) / 2 - position.y;

    const sx = offsetX * scaleX;
    const sy = offsetY * scaleY;
    const sw = containerWidth * scaleX;
    const sh = containerHeight * scaleY;

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

    // Export as JPEG
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
    onApply(croppedUrl);
    onOpenChange(false);
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Crop Area */}
      <div 
        ref={containerRef}
        className="relative flex-1 min-h-[300px] bg-black/90 overflow-hidden cursor-move rounded-xl mx-4 my-4"
        style={{ aspectRatio: `${ASPECT_RATIO}` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {imageLoaded && imageRef.current && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <img
              src={imageUrl}
              alt="Crop preview"
              className="max-w-none pointer-events-none"
              style={{
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              draggable={false}
            />
          </div>
        )}
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        {/* Move indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm flex items-center gap-2 text-xs text-muted-foreground">
          <Move className="w-3 h-3" />
          Trascina per centrare
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="px-6 py-4 border-t border-border bg-background/50">
        <div className="flex items-center gap-4">
          <ZoomOut className="w-4 h-4 text-muted-foreground" />
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={([value]) => setZoom(value)}
            className="flex-1"
          />
          <ZoomIn className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground w-12 text-right">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 p-4 border-t border-border">
        <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
          Annulla
        </Button>
        <Button className="flex-1" onClick={handleApply}>
          Applica
        </Button>
      </div>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[95vh] p-0 rounded-t-2xl flex flex-col">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle>Modifica immagine</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle>Modifica immagine</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
