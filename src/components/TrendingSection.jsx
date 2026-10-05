import React, { useRef, useState, useEffect } from 'react';
import { trendingPackages } from '../data/websiteData';

function PackageCard({ pkg, onCardClick }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? pkg.images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === pkg.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      onClick={() => onCardClick(pkg)}
      className="cardMargin flex-shrink-0 cursor-pointer group pb-4"
      style={{ width: '280px' }}
    >
      {/* Top Image Slider Card */}
      <div className="rounded-3xl relative shadow-md overflow-hidden bg-gray-100 z-10 transition-transform duration-300 group-hover:shadow-xl">
        <div className="relative w-full h-[210px] overflow-hidden">
          <img
            loading="lazy"
            src={pkg.images[activeImageIndex]}
            alt={`${pkg.title} - Slide ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Left Arrow Button for card images */}
          <button
            onClick={prevImage}
            aria-label="Previous photo"
            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-7 h-7 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.7 15.3a1 1 0 01-1.4 0l-5-5a1 1 0 010-1.4l5-5a1 1 0 111.4 1.4L8.41 10l4.3 4.3a1 1 0 010 1.4z" />
            </svg>
          </button>

          {/* Right Arrow Button for card images */}
          <button
            onClick={nextImage}
            aria-label="Next photo"
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-7 h-7 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.3 4.7a1 1 0 011.4 0l5 5a1 1 0 010 1.4l-5 5a1 1 0 01-1.4-1.4L11.59 10 7.3 5.7a1 1 0 010-1.4z" />
            </svg>
          </button>

          {/* Image Dots Indicator */}
          <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
            {pkg.images.map((_, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  idx === activeImageIndex ? 'bg-white w-3' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Info Details Card */}
      <div className="bg-white rounded-b-3xl shadow-lg border border-gray-100 p-4 -mt-3 pt-5 relative z-0 flex flex-col justify-between min-h-[185px]">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {pkg.duration}
          </p>
          <h3 className="font-bold productSansBold text-base md:text-lg text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors">
            {pkg.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-1 mb-3">
            {pkg.route}
          </p>
        </div>

        {/* Price & Savings Badges */}
        <div className="border-t border-gray-100 pt-2.5">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {pkg.badge && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                pkg.badge === 'Early Bird'
                  ? 'border-[#89C1FB] bg-[#EBF5FE] text-blue-700'
                  : 'border-[#58E458] bg-[#E9FEE5] text-green-700'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {pkg.badge}
              </span>
            )}
            {pkg.secondaryBadge && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md border border-[#58E458] bg-[#E9FEE5] text-green-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {pkg.secondaryBadge}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-primary productSansBold text-lg md:text-xl font-bold">
              ₹ {pkg.price.toLocaleString('en-IN')}
            </span>
            <span className="text-gray-400 text-xs md:text-sm line-through font-normal">
              ₹ {pkg.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrendingSection({ onPackageSelect }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="relative container mx-auto md:pt-10 pt-6">
      {/* Section Header */}
      <div className="pb-4 px-4 productSansBold">
        <h2 className="md:text-2xl text-xl ProductSans font-bold text-gray-900">
          Trending
        </h2>
      </div>

      <div className="flex relative">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Previous packages"
            className="absolute top-1/2 transform -translate-y-1/2 bg-white shadow-xl hover:bg-gray-50 border border-gray-200 rounded-full p-2.5 z-20 -left-4 hidden md:flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Scrollable Cards Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto no-scrollbar space-x-5 py-2 w-full scroll-smooth"
        >
          {trendingPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onCardClick={onPackageSelect}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            aria-label="Next packages"
            className="absolute top-1/2 transform -translate-y-1/2 bg-white shadow-xl hover:bg-gray-50 border border-gray-200 rounded-full p-2.5 z-20 -right-4 hidden md:flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
