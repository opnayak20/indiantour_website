import React, { useRef, useState, useEffect } from 'react';
import { domesticDestinations } from '../data/websiteData';

export default function DomesticDestinations({ onDestinationSelect }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const getDestList = () => {
    try {
      const stored = localStorage.getItem('admin_domestic_destinations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return domesticDestinations;
  };

  const [destList, setDestList] = useState(getDestList);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'admin_domestic_destinations') {
        setDestList(getDestList());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [destList]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 320);
    }
  };

  return (
    <div className="relative bg-white">
      <div className="py-6 md:py-10 container mx-auto px-4 md:px-6">
        
        {/* Section Heading */}
        <div className="pb-2 pt-4 md:pt-0 px-2 md:px-1 productSansBold">
          <h2 className="md:text-2xl text-xl ProductSans font-bold text-gray-900 tracking-tight">
            Domestic Destinations
          </h2>
        </div>

        <div className="flex relative items-center">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous domestic destinations"
              className="absolute top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2.5 z-20 -left-3 md:-left-6 hidden md:flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-md"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="#333333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Destination Cards Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto no-scrollbar py-2 md:py-4 px-2 md:px-0 w-full scroll-smooth"
          >
            {destList.map((dest, idx) => (
              <div
                key={idx}
                onClick={() => onDestinationSelect && onDestinationSelect(dest)}
                className="avian-dest-card group"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={dest.image}
                  alt={dest.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="object-cover w-full h-full"
                />
                {/* Destination Name Overlay */}
                <div className="avian-dest-card-overlay">
                  <span className="avian-dest-card-name">{dest.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next domestic destinations"
              className="absolute top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2.5 z-20 -right-3 md:-right-6 hidden md:flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-md"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="#333333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
