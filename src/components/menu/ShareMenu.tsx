import { useState, useRef, useEffect } from "react";
import { Share2, Copy, Link2, QrCode, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareMenuProps {
  title: string;
  query?: string;
}

export function ShareMenu({ title, query }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBaseUrl = () => {
    return window.location.origin + window.location.pathname;
  };

  const getUrlWithQuery = () => {
    if (!query || query.length < 2) return getBaseUrl();
    const url = new URL(getBaseUrl());
    url.searchParams.set("q", query);
    return url.toString();
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: title,
      url: getBaseUrl(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setIsOpen(false);
      } else {
        await copyToClipboard(getBaseUrl(), "link");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        await copyToClipboard(getBaseUrl(), "link");
      }
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success("Link copiato");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Impossibile copiare il link");
    }
  };

  const handleCopyLink = async () => {
    await copyToClipboard(getBaseUrl(), "link");
    setIsOpen(false);
  };

  const handleCopyWithQuery = async () => {
    await copyToClipboard(getUrlWithQuery(), "query");
    setIsOpen(false);
  };

  const handleDownloadQR = async () => {
    const url = getBaseUrl();
    // Use a public QR code API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&format=png`;

    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success("QR code scaricato");
      setIsOpen(false);
    } catch {
      toast.error("Impossibile scaricare il QR code");
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary active:bg-muted transition-colors"
        aria-label="Condividi menu"
        aria-expanded={isOpen}
      >
        <Share2 className="w-5 h-5 text-foreground" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full right-0 mt-2 w-56",
            "bg-popover border border-border rounded-xl shadow-lg",
            "overflow-hidden z-50",
            "animate-in fade-in-0 slide-in-from-top-2 duration-200"
          )}
        >
          <ul className="py-1">
            {/* Native share (if supported) */}
            {typeof navigator !== "undefined" && navigator.share && (
              <li>
                <button
                  onClick={handleNativeShare}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-popover-foreground hover:bg-secondary/50 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                  Condividi
                </button>
              </li>
            )}

            {/* Copy link */}
            <li>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-popover-foreground hover:bg-secondary/50 transition-colors"
              >
                {copied === "link" ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
                Copia link del menu
              </button>
            </li>

            {/* Copy link with query (only if query active) */}
            {query && query.length >= 2 && (
              <li>
                <button
                  onClick={handleCopyWithQuery}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-popover-foreground hover:bg-secondary/50 transition-colors"
                >
                  {copied === "query" ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Link2 className="w-4 h-4 text-muted-foreground" />
                  )}
                  Copia link con ricerca
                </button>
              </li>
            )}

            {/* Download QR */}
            <li>
              <button
                onClick={handleDownloadQR}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-popover-foreground hover:bg-secondary/50 transition-colors"
              >
                <QrCode className="w-4 h-4 text-muted-foreground" />
                Scarica QR del menu
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
