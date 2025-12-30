import { RestaurantInfo } from "@/data/menuData";

interface OpenStateResult {
  isOpen: boolean;
  nextOpenDateTime: Date | null;
  currentWindowEnd: Date | null;
}

interface TimeRange {
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
}

// Parse time ranges from hours string (e.g., "12:00 - 14:30, 19:00 - 23:00")
function parseTimeRanges(hoursString: string): TimeRange[] {
  if (!hoursString.trim()) return [];
  
  const ranges: TimeRange[] = [];
  const parts = hoursString.split(",").map(s => s.trim());
  
  for (const part of parts) {
    const match = part.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (match) {
      const [, startH, startM, endH, endM] = match;
      ranges.push({
        startHour: parseInt(startH, 10),
        startMin: parseInt(startM, 10),
        endHour: parseInt(endH, 10),
        endMin: parseInt(endM, 10),
      });
    }
  }
  
  return ranges;
}

// Get Italian day index (0 = Monday, 6 = Sunday)
function getItalianDayIndex(date: Date): number {
  const dayIndex = date.getDay();
  return dayIndex === 0 ? 6 : dayIndex - 1;
}

// Get next date for a specific Italian day index
function getNextDateForDayIndex(fromDate: Date, targetDayIndex: number): Date {
  const currentDayIndex = getItalianDayIndex(fromDate);
  let daysToAdd = targetDayIndex - currentDayIndex;
  if (daysToAdd <= 0) daysToAdd += 7;
  
  const result = new Date(fromDate);
  result.setDate(result.getDate() + daysToAdd);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getOpenState(weeklyHours: RestaurantInfo["weeklyHours"], now: Date = new Date()): OpenStateResult {
  const italianDayIndex = getItalianDayIndex(now);
  const todayHours = weeklyHours[italianDayIndex];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // If today is closed
  if (todayHours.closed || !todayHours.hours.trim()) {
    // Find next open day
    const nextOpen = findNextOpenDateTime(weeklyHours, now, italianDayIndex);
    return {
      isOpen: false,
      nextOpenDateTime: nextOpen,
      currentWindowEnd: null,
    };
  }
  
  // Parse today's time ranges
  const ranges = parseTimeRanges(todayHours.hours);
  
  if (ranges.length === 0) {
    const nextOpen = findNextOpenDateTime(weeklyHours, now, italianDayIndex);
    return {
      isOpen: false,
      nextOpenDateTime: nextOpen,
      currentWindowEnd: null,
    };
  }
  
  // Check if we're within any time range
  for (const range of ranges) {
    const startMinutes = range.startHour * 60 + range.startMin;
    let endMinutes = range.endHour * 60 + range.endMin;
    
    // Handle midnight (00:00 means end of day)
    if (endMinutes === 0) endMinutes = 24 * 60;
    
    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      // Currently open
      const windowEnd = new Date(now);
      windowEnd.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);
      
      return {
        isOpen: true,
        nextOpenDateTime: null,
        currentWindowEnd: windowEnd,
      };
    }
  }
  
  // Not in any range - find next open time
  // First check if there's a later range today
  for (const range of ranges) {
    const startMinutes = range.startHour * 60 + range.startMin;
    if (startMinutes > currentMinutes) {
      const nextOpen = new Date(now);
      nextOpen.setHours(range.startHour, range.startMin, 0, 0);
      return {
        isOpen: false,
        nextOpenDateTime: nextOpen,
        currentWindowEnd: null,
      };
    }
  }
  
  // No more ranges today, find next day
  const nextOpen = findNextOpenDateTime(weeklyHours, now, italianDayIndex, true);
  return {
    isOpen: false,
    nextOpenDateTime: nextOpen,
    currentWindowEnd: null,
  };
}

function findNextOpenDateTime(
  weeklyHours: RestaurantInfo["weeklyHours"],
  now: Date,
  currentDayIndex: number,
  skipToday: boolean = false
): Date | null {
  // Search up to 7 days
  for (let offset = skipToday ? 1 : 0; offset <= 7; offset++) {
    const dayIndex = (currentDayIndex + offset) % 7;
    const dayHours = weeklyHours[dayIndex];
    
    if (dayHours.closed || !dayHours.hours.trim()) continue;
    
    const ranges = parseTimeRanges(dayHours.hours);
    if (ranges.length === 0) continue;
    
    // Get the first range of this day
    const firstRange = ranges[0];
    
    if (offset === 0) {
      // Today - check if any range is still upcoming
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      for (const range of ranges) {
        const startMinutes = range.startHour * 60 + range.startMin;
        if (startMinutes > currentMinutes) {
          const nextOpen = new Date(now);
          nextOpen.setHours(range.startHour, range.startMin, 0, 0);
          return nextOpen;
        }
      }
    } else {
      // Future day
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + offset);
      targetDate.setHours(firstRange.startHour, firstRange.startMin, 0, 0);
      return targetDate;
    }
  }
  
  return null;
}

// Format next open time for display
export function formatNextOpenTime(nextOpenDateTime: Date, now: Date = new Date()): { time: string; day?: string } {
  const timeStr = nextOpenDateTime.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });
  
  const isToday = 
    nextOpenDateTime.getDate() === now.getDate() &&
    nextOpenDateTime.getMonth() === now.getMonth() &&
    nextOpenDateTime.getFullYear() === now.getFullYear();
  
  const isTomorrow = (() => {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return (
      nextOpenDateTime.getDate() === tomorrow.getDate() &&
      nextOpenDateTime.getMonth() === tomorrow.getMonth() &&
      nextOpenDateTime.getFullYear() === tomorrow.getFullYear()
    );
  })();
  
  if (isToday) {
    return { time: timeStr };
  }
  
  const dayStr = isTomorrow
    ? "domani"
    : nextOpenDateTime.toLocaleDateString("it-IT", {
        weekday: "long",
        timeZone: "Europe/Rome",
      });
  
  return { time: timeStr, day: dayStr };
}

// Calculate minutes until next open
export function getMinutesUntilOpen(nextOpenDateTime: Date, now: Date = new Date()): number {
  return Math.max(0, Math.floor((nextOpenDateTime.getTime() - now.getTime()) / 60000));
}
