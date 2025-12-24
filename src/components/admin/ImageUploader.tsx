import { useState, useRef, useCallback } from 'react';
import { Upload, MoreVertical, Trash2, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  className?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_DIMENSION = 1600;

export function ImageUploader({ imageUrl, onImageChange, className }: ImageUploaderProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions
          let { width, height } = img;
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = (height / width) * MAX_DIMENSION;
              width = MAX_DIMENSION;
            } else {
              width = (width / height) * MAX_DIMENSION;
              height = MAX_DIMENSION;
            }
          }

          // Create canvas and resize
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 (JPEG for smaller size)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: 'Formato non supportato',
        description: 'Usa JPG, PNG o WebP',
        variant: 'destructive',
      });
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File troppo grande',
        description: 'Dimensione massima: 2MB',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const resizedUrl = await resizeImage(file);
      onImageChange(resizedUrl);
      toast({ title: 'Immagine caricata', duration: 2000 });
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Impossibile elaborare l\'immagine',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleDelete = () => {
    onImageChange('');
    setHasError(false);
    toast({ title: 'Immagine rimossa', duration: 2000 });
  };

  const handleReplace = () => {
    inputRef.current?.click();
  };

  const hasValidImage = imageUrl && !hasError;

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileSelect}
        className="hidden"
        capture="environment"
      />

      {hasValidImage ? (
        /* Image Preview with Actions */
        <div className="relative rounded-xl overflow-hidden border border-border bg-secondary/30">
          <div className="aspect-[4/3] relative">
            <img
              src={imageUrl}
              alt="Anteprima prodotto"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setHasError(true)}
            />
            {/* Kebab Menu */}
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem onClick={handleReplace}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sostituisci foto
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Elimina foto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Dimensions Badge */}
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
              <ImageIcon className="w-3 h-3 inline mr-1" />
              4:3
            </div>
          </div>
        </div>
      ) : (
        /* Upload Zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'aspect-[4/3] rounded-xl border-2 border-dashed cursor-pointer transition-all',
            'flex flex-col items-center justify-center gap-3',
            'bg-secondary/30 hover:bg-secondary/50',
            isDragging && 'border-primary bg-primary/10',
            isLoading && 'pointer-events-none opacity-60'
          )}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Caricamento...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Carica immagine</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Trascina qui o clicca per selezionare
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP • Max 2MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
