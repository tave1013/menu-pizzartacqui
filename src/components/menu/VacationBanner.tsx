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
    <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center py-4 px-4">
      <div className="bg-gradient-to-r from-yellow-400/80 via-yellow-300/80 to-yellow-400/80 backdrop-blur-sm rounded-2xl border border-yellow-500/40 py-3 px-4 flex items-center gap-3 max-w-full w-full sm:w-auto">
        {/* Pulsing dot */}
        <div className="flex-shrink-0">
          <div className="relative w-3 h-3">
            <div className="absolute inset-0 bg-yellow-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-yellow-600 rounded-full"></div>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm sm:text-base text-yellow-900 dark:text-yellow-800 font-medium">
          Siamo in ferie dal 14 settembre. Riapriremo presto!
        </p>
      </div>
    </div>
  );
}
