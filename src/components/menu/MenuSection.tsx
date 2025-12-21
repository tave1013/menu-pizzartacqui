import { Category, MenuItem } from "@/data/menuData";
import { MenuItemCard } from "./MenuItemCard";

interface MenuSectionProps {
  category: Category;
  onItemClick: (item: MenuItem) => void;
}

export function MenuSection({ category, onItemClick }: MenuSectionProps) {
  return (
    <section id={category.id} className="scroll-mt-36">
      <h2 className="text-xl font-bold text-foreground mb-4">
        {category.name}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-4">
        {category.items.map((item, index) => (
          <MenuItemCard
            key={item.id}
            item={item}
            index={index}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </section>
  );
}
