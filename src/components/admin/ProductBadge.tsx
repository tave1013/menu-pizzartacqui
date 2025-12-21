import { cn } from "@/lib/utils";
import { BADGE_OPTIONS } from "@/data/adminMockData";

interface ProductBadgeProps {
  badge: string;
  size?: "sm" | "md";
}

export function ProductBadge({ badge, size = "sm" }: ProductBadgeProps) {
  const option = BADGE_OPTIONS.find((b) => b.value === badge);
  if (!option) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        option.color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {option.label}
    </span>
  );
}

export function ProductBadges({ badges, size = "sm" }: { badges: string[]; size?: "sm" | "md" }) {
  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((badge) => (
        <ProductBadge key={badge} badge={badge} size={size} />
      ))}
    </div>
  );
}
