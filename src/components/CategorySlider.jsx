import React, { useRef, useState, useEffect } from 'react';
import { categories } from '../data/categoriesData';

export default function CategorySlider({ selectedCategory, onSelectCategory }) {
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
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
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
    <div className="relative bg-white pt-2 pb-2">
      <div className="flex relative container mx-auto px-1 md:px-6">
        
        {/* Left Arrow Button (Desktop Only) */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="absolute top-1/2 transform -translate-y-1/2 bg-white opacity-95 border-2 border-gray-200 rounded-full p-2 z-10 -left-3 md:-left-6 hidden md:flex items-center justify-center cursor-pointer shadow-md hover:opacity-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M12.1683 5.58398C12.3211 5.73676 12.3975 5.93121 12.3975 6.16732C12.3975 6.40343 12.3211 6.59787 12.1683 6.75065L8.91829 10.0007L12.1683 13.2507C12.3211 13.4034 12.3975 13.5979 12.3975 13.834C12.3975 14.0701 12.3211 14.2645 12.1683 14.4173C12.0155 14.5701 11.8211 14.6465 11.585 14.6465C11.3489 14.6465 11.1544 14.5701 11.0016 14.4173L7.16829 10.584C7.08496 10.5006 7.02579 10.4104 6.99079 10.3132C6.95579 10.2159 6.93857 10.1118 6.93913 10.0007C6.93913 9.88954 6.95663 9.78537 6.99163 9.68815C7.02663 9.59093 7.08552 9.50065 7.16829 9.41732L11.0016 5.58398C11.1544 5.43121 11.3489 5.35482 11.585 5.35482C11.8211 5.35482 12.0155 5.43121 12.1683 5.58398Z" fill="#515151" />
            </svg>
          </button>
        )}

        {/* Scrollable Track: 4 items fit across mobile screen */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto no-scrollbar px-1 md:px-0 pt-1 pb-1 md:space-x-10 scroll-smooth w-full items-center justify-start"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className="category-item-mobile flex-shrink-0 group cursor-pointer pb-1 text-center"
              >
                <div className="w-10 h-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    width="36"
                    height="36"
                    className="mx-auto object-contain h-9 w-9"
                  />
                </div>
                <div
                  className={`pt-1.5 whitespace-nowrap text-xs md:text-sm font-medium transition-colors ${
                    isSelected ? 'text-primary font-bold' : 'text-gray-800 group-hover:text-primary'
                  }`}
                >
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button (Desktop Only) matching user screenshot */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="absolute top-1/2 transform -translate-y-1/2 bg-white opacity-95 border-2 border-gray-200 rounded-full p-2 z-10 -right-3 md:-right-6 hidden md:flex items-center justify-center cursor-pointer shadow-md hover:opacity-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M7.83171 14.416C7.67893 14.2632 7.60254 14.0688 7.60254 13.8327C7.60254 13.5966 7.67893 13.4021 7.83171 13.2493L11.0817 9.99935L7.83171 6.74935C7.67893 6.59657 7.60254 6.40213 7.60254 6.16602C7.60254 5.9299 7.67893 5.73546 7.83171 5.58268C7.98448 5.4299 8.17893 5.35352 8.41504 5.35352C8.65115 5.35352 8.84559 5.4299 8.99837 5.58268L12.8317 9.41602C12.915 9.49935 12.9742 9.58963 13.0092 9.68685C13.0442 9.78407 13.0614 9.88824 13.0609 9.99935C13.0609 10.1105 13.0434 10.2146 13.0084 10.3118C12.9734 10.4091 12.9145 10.4993 12.8317 10.5827L8.99837 14.416C8.84559 14.5688 8.65115 14.6452 8.41504 14.6452C8.17893 14.6452 7.98448 14.5688 7.83171 14.416Z" fill="#515151" />
            </svg>
          </button>
        )}

      </div>
    </div>
  );
}
