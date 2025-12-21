import { useMemo, useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FullscreenCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  today: Date;
  maxDate: Date;
  isDateDisabled: (date: Date) => boolean;
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const MONTH_NAMES_SHORT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Get day of week (0 = Sunday), convert to Monday-first (0 = Monday)
  let startDayOfWeek = firstDay.getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  
  // Fill in days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push(prevDate);
  }
  
  // Fill in days of current month
  const lastDay = new Date(year, month + 1, 0);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  
  // Fill in days from next month to complete 6 rows (42 cells)
  while (days.length < 42) {
    const nextDate = new Date(year, month + 1, days.length - lastDay.getDate() - startDayOfWeek + 1);
    days.push(nextDate);
  }
  
  return days;
}

export function FullscreenCalendar({
  selectedDate,
  onSelectDate,
  today,
  maxDate,
  isDateDisabled
}: FullscreenCalendarProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [viewMonth, setViewMonth] = useState<Date>(() => selectedDate || today);
  
  // Block vertical touch scrolling on calendar grid
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    
    let startY = 0;
    let startX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      const deltaX = Math.abs(e.touches[0].clientX - startX);
      // Block if vertical movement is greater than horizontal
      if (deltaY > deltaX) {
        e.preventDefault();
      }
    };
    
    grid.addEventListener("touchstart", handleTouchStart, { passive: true });
    grid.addEventListener("touchmove", handleTouchMove, { passive: false });
    
    return () => {
      grid.removeEventListener("touchstart", handleTouchStart);
      grid.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  
  const calendarDays = useMemo(() => {
    return getCalendarDays(viewMonth.getFullYear(), viewMonth.getMonth());
  }, [viewMonth]);
  
  const monthLabel = useMemo(() => {
    return viewMonth.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  }, [viewMonth]);
  
  const goToPrevMonth = () => {
    setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  // Check if a date is within the booking window (today to maxDate)
  const isInBookingWindow = (date: Date): boolean => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    return dateOnly >= todayOnly && dateOnly <= maxDateOnly;
  };
  
  const handleDayClick = (date: Date) => {
    // Allow selection if date is in booking window and not disabled
    if (!isInBookingWindow(date)) return;
    if (isDateDisabled(date)) return;
    onSelectDate(date);
  };
  
  return (
    <div 
      ref={calendarRef}
      className="flex flex-col h-full select-none"
      style={{
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Month navigation */}
      <div className="flex items-center justify-between px-2 mb-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevMonth}
          className="h-10 w-10 rounded-full"
          aria-label="Mese precedente"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-lg font-semibold capitalize">{monthLabel}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          className="h-10 w-10 rounded-full"
          aria-label="Mese successivo"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 px-2 mb-1 shrink-0">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid - 6 rows × 7 columns, fills all remaining space */}
      <div 
        ref={gridRef}
        className="grid grid-cols-7 flex-1 gap-1 px-2 pb-2"
        style={{ 
          gridTemplateRows: "repeat(6, 1fr)",
          touchAction: "pan-x",
          overscrollBehavior: "contain",
          minHeight: 0,
        }}
      >
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === viewMonth.getMonth();
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isDisabled = isDateDisabled(date);
          const inBookingWindow = isInBookingWindow(date);
          
          // Clickable if in booking window and not disabled
          const isClickable = inBookingWindow && !isDisabled;
          
          // Determine visual state
          const isOutsideWindow = !inBookingWindow;
          const isOtherMonth = !isCurrentMonth;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDayClick(date)}
              disabled={!isClickable}
              className={cn(
                "flex flex-col items-center justify-center text-base font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 relative",
                // Outside booking window
                isOutsideWindow && "pointer-events-none",
                // Disabled days within booking window
                !isOutsideWindow && isDisabled && "cursor-not-allowed",
                // Clickable days
                isClickable && "hover:bg-muted/50"
              )}
              style={{ minHeight: 0 }}
              aria-label={date.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
              aria-selected={isSelected}
              aria-disabled={!isClickable}
            >
              <span 
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-full transition-colors text-sm",
                  // Outside booking window (completely faded)
                  isOutsideWindow && "text-muted-foreground/30",
                  // Disabled days in booking window
                  !isOutsideWindow && isDisabled && "text-muted-foreground/50",
                  // Normal clickable days
                  isClickable && "text-foreground",
                  // Other month but in booking window - slightly different style
                  isClickable && isOtherMonth && "text-foreground",
                  // Today indicator (subtle ring)
                  isToday && !isSelected && "ring-2 ring-primary/30 ring-offset-1",
                  // Selected day (filled circle)
                  isSelected && "bg-primary text-primary-foreground font-semibold"
                )}
              >
                {date.getDate()}
              </span>
              {/* Month indicator for days from other months that are in booking window */}
              {isOtherMonth && inBookingWindow && !isDisabled && (
                <span className="text-[9px] text-muted-foreground/70 leading-none -mt-0.5">
                  {MONTH_NAMES_SHORT[date.getMonth()]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
