import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Category } from "@/data/menuData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  // Auto-scroll active category into view
  useEffect(() => {
    if (activeButtonRef.current && navRef.current) {
      const nav = navRef.current;
      const button = activeButtonRef.current;
      const navRect = nav.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      const scrollLeft = button.offsetLeft - nav.offsetWidth / 2 + button.offsetWidth / 2;
      nav.scrollTo({
        left: scrollLeft,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    }
  }, [activeCategory, prefersReduced]);

  const handleClick = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      const offset = 140;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    }
    onCategoryClick(categoryId);
  };

  return (
    <motion.nav
      initial={prefersReduced ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
      className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      <div className="container">
        <div
          ref={navRef}
          className="flex gap-1 overflow-x-auto scrollbar-hide py-3 -mx-4 px-4 sm:-mx-6 sm:px-6"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                ref={isActive ? activeButtonRef : null}
                onClick={() => handleClick(category.id)}
                className={cn(
                  "relative flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-160",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isActive
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {category.name}
                {isActive && !prefersReduced && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
