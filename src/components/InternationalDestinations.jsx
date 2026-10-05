import React, { useRef, useState, useEffect } from 'react';
import { internationalDestinations } from '../data/websiteData';

export default function InternationalDestinations({ onDestinationSelect }) {
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
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative bg-[#ebebeb] md:bg-grey">
      <div className="py-6 md:py-10 container mx-auto px-4 md:px-6">
        
        {/* Section Heading */}
        <div className="pb-3 pt-4 md:pt-0 productSansBold flex items-center justify-between">
          <h2 className="md:text-2xl text-xl ProductSans font-bold text-gray-900">
            International Destinations
          </h2>
          <span className="text-xs md:text-sm text-gray-600">
            Passports ready
          </span>
        </div>

        <div className="flex relative">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous international destinations"
              className="absolute top-1/2 transform -translate-y-1/2 bg-white shadow-xl hover:bg-gray-50 border border-gray-200 rounded-full p-2.5 z-20 -left-4 hidden md:flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Destination Cards Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto no-scrollbar space-x-4 md:space-x-5 py-3 w-full scroll-smooth"
          >
            {internationalDestinations.map((dest, idx) => (
              <div
                key={idx}
                onClick={() => onDestinationSelect(dest)}
                className="overflow-hidden flex-shrink-0 cursor-pointer rounded-[24px] md:rounded-[30px] shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative group"
                style={{ width: '210px', height: '310px' }}
              >
                <img
                  loading="lazy"
                  src={dest.image}
                  alt={dest.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Destination Name */}
                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                  <h3 className="text-lg md:text-xl font-bold productSansBold tracking-wide drop-shadow">
                    {dest.name}
                  </h3>
                  <span className="text-[11px] text-gray-200 font-medium inline-flex items-center gap-1 group-hover:text-yellow-300 transition-colors">
                    Explore Packages
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next international destinations"
              className="absolute top-1/2 transform -translate-y-1/2 bg-white shadow-xl hover:bg-gray-50 border border-gray-200 rounded-full p-2.5 z-20 -right-4 hidden md:flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
