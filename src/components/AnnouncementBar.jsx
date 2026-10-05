import React from 'react';

export default function AnnouncementBar({ onOpenEmiModal }) {
  return (
    <div className="relative w-full overflow-hidden bg-primary text-white select-none z-30 py-2 px-3 text-center">
      {/* Moving Shine Effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="container mx-auto relative h-full">
          <span className="offer-bar-shine z-10">
            <svg width="24" height="100%" viewBox="0 0 24 38" fill="none" preserveAspectRatio="none" className="block h-full">
              <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.5" />
              <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.5" />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center text-xs sm:text-sm font-semibold tracking-wide">
        <p className="whitespace-nowrap">
          <span>Sale of the Season is live • </span>
          <button
            type="button"
            onClick={onOpenEmiModal}
            className="underline underline-offset-2 font-bold cursor-pointer hover:text-gray-100 transition-colors"
          >
            Explore Now
          </button>
        </p>
      </div>
    </div>
  );
}
