import React from "react";
import { Star, ChevronRight } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";

interface ReviewBannerProps {
  className?: string;
}

const ReviewBanner: React.FC<ReviewBannerProps> = ({ className = "" }) => {
  const reviewUrl = restaurantInfo.googleReviewUrl || restaurantInfo.googleBusinessUrl;

  if (!reviewUrl) return null;

  return (
    <a
      href={reviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block ${className}`}
    >
      <div className="mx-4 sm:mx-6 lg:mx-8 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] overflow-hidden">
        <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
          {/* Star Icon */}
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
              Ti è piaciuta la nostra pizza? ⭐
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-snug">
              Lasciaci una recensione su Google, ci aiuta davvero tanto 🍕
            </p>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 border border-amber-200/60 flex items-center justify-center shadow-sm">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ReviewBanner;
