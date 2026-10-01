import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function VacationBanner() {
  const [isVacation, setIsVacation] = useState(false);

  useEffect(() => {
    const today = new Date();
    const vacationStart = new Date('2026-09-14');
    const vacationEnd = new Date('2026-10-08');

    if (today >= vacationStart && today <= vacationEnd) {
      setIsVacation(true);
    }
  }, []);

  if (!isVacation) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-400/80 via-yellow-300/80 to-yellow-400/80 backdrop-blur-sm py-4 px-4">
      <div className="container">
        <div className="flex items-center gap-3">
          {/* Orologio icon */}
          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-700 flex-shrink-0" />

          {/* Message */}
          <p className="text-sm sm:text-base text-yellow-900 dark:text-yellow-800 font-medium">
            Siamo in ferie dal 14 settembre. Riapriremo presto!
          </p>
        </div>
      </div>
    </div>
  );
}
