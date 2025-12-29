import React from "react";
import { ChevronRight } from "lucide-react";
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
      <div className="mx-4 sm:mx-6 lg:mx-8 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800">
              <span className="font-medium">Ti è piaciuta la nostra pizza?</span> ⭐
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Lasciaci una recensione su Google, ci aiuta davvero tanto 🍕
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3" />
        </div>
      </div>
    </a>
  );
};

export default ReviewBanner;
