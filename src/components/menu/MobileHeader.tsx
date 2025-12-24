import { Share2, Search } from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { forwardRef } from "react";
import { LanguageSelector } from "./LanguageSelector";

interface MobileHeaderProps {
  title: string;
  onSearchClick: () => void;
  searchButtonRef?: React.RefObject<HTMLButtonElement>;
}

export const MobileHeader = forwardRef<HTMLButtonElement, MobileHeaderProps>(
  ({ title, onSearchClick }, ref) => {
    const isScrolled = useScrollPosition(32);

    const handleShare = async () => {
      const shareData = {
        title: title,
        url: window.location.href,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link del menu copiato");
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link del menu copiato");
        }
      }
    };

    return (
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 lg:hidden",
          "bg-background/95 backdrop-blur-md border-b border-border/50",
          "transition-all duration-200 ease-out",
          "safe-area-inset-top",
          isScrolled
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between h-14 px-2">
          {/* Left: Language + Share */}
          <div className="flex items-center">
            <LanguageSelector />
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-secondary/80 active:bg-secondary transition-colors"
              aria-label="Condividi menu"
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Title */}
          <h1 className="text-base font-semibold text-foreground truncate px-2">
            {title}
          </h1>

          {/* Search Button */}
          <button
            ref={ref}
            onClick={onSearchClick}
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-secondary/80 active:bg-secondary transition-colors"
            aria-label="Cerca nel menu"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>
    );
  }
);

MobileHeader.displayName = "MobileHeader";
