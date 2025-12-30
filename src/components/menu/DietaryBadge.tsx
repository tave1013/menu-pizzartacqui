import { Leaf, Wheat, Sprout, Moon, MilkOff } from "lucide-react";
import { cn } from "@/lib/utils";

export type DietaryTag = "vegan" | "vegetarian" | "gluten-free" | "halal" | "lactose-free";

interface DietaryBadgeProps {
  tag: DietaryTag;
  size?: "sm" | "md";
}

const tagConfig: Record<DietaryTag, { label: string; icon: typeof Leaf; colorClass: string }> = {
  vegan: {
    label: "Vegano",
    icon: Sprout,
    colorClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  vegetarian: {
    label: "Vegetariano",
    icon: Leaf,
    colorClass: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-400",
  },
  "gluten-free": {
    label: "Senza glutine",
    icon: Wheat,
    colorClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  halal: {
    label: "Halal",
    icon: Moon,
    colorClass: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
  },
  "lactose-free": {
    label: "Senza lattosio",
    icon: MilkOff,
    colorClass: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
  },
};

export function DietaryBadge({ tag, size = "sm" }: DietaryBadgeProps) {
  const config = tagConfig[tag];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-medium",
        config.colorClass,
        size === "sm" && "px-2 py-0.5 text-[11px]",
        size === "md" && "px-2.5 py-1 text-xs"
      )}
    >
      <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
      {config.label}
    </span>
  );
}

interface DietaryBadgesProps {
  tags?: DietaryTag[];
  isHalal?: boolean;
  isLactoseFree?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function DietaryBadges({ tags, isHalal, isLactoseFree, size = "sm", className }: DietaryBadgesProps) {
  // Combine explicit tags with isHalal/isLactoseFree flags
  const allTags: DietaryTag[] = [...(tags || [])];
  if (isHalal && !allTags.includes("halal")) allTags.push("halal");
  if (isLactoseFree && !allTags.includes("lactose-free")) allTags.push("lactose-free");
  
  if (allTags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {allTags.map((tag) => (
        <DietaryBadge key={tag} tag={tag} size={size} />
      ))}
    </div>
  );
}
