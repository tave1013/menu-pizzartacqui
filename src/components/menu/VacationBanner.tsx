import { useEffect, useState } from "react";

export function VacationBanner() {
  const [isVacation, setIsVacation] = useState(false);

  useEffect(() => {
    const today = new Date();
    const vacationStart = new Date('2026-09-14');
    const vacationEnd = new Date('2026-09-30');

    if (today >= vacationStart && today <= vacationEnd) {
      setIsVacation(true);
    }
  }, []);

  if (!isVacation) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-green-500/20 via-green-400/25 to-green-500/20 backdrop-blur-sm border-b border-green-600/40 py-3 px-4">
      <div className="flex items-center gap-3 max-w-full">
        {/* Pulsing dot */}
        <div className="flex-shrink-0">
          <div className="relative w-3 h-3">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm sm:text-base text-green-900 dark:text-green-100 font-medium flex-grow">
          Siamo in ferie dal 14 settembre. Riapriremo presto!
        </p>
      </div>
    </div>
  );
}
