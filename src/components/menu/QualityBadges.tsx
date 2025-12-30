import { cn } from "@/lib/utils";

interface QualityBadgesProps {
  isHalal?: boolean;
  isLactoseFree?: boolean;
  className?: string;
  position?: "overlay" | "inline";
}

export function QualityBadges({ 
  isHalal, 
  isLactoseFree, 
  className,
  position = "overlay"
}: QualityBadgesProps) {
  if (!isHalal && !isLactoseFree) return null;

  const badges = [];
  
  if (isHalal) {
    badges.push({
      label: "Halal",
      colorClass: "bg-emerald-100/90 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    });
  }
  
  if (isLactoseFree) {
    badges.push({
      label: "Senza lattosio",
      colorClass: "bg-sky-100/90 text-sky-700 dark:bg-sky-900/70 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    });
  }

  return (
    <div 
      className={cn(
        "flex flex-col gap-1",
        position === "overlay" && "absolute top-1.5 left-1.5 lg:top-2 lg:left-2 z-10",
        className
      )}
    >
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border",
            "backdrop-blur-sm",
            badge.colorClass
          )}
          aria-label={`Badge ${badge.label}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
