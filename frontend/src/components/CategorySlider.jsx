import React, { useRef, useState, useEffect, useCallback } from 'react';
import { categories } from '../data/categoriesData';

export default function CategorySlider({ selectedCategory, onSelectCategory }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  // Auto-center active category in scrollable viewport
  useEffect(() => {
    if (selectedCategory && scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('.is-selected');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        setTimeout(checkScroll, 350);
      }
    }
  }, [selectedCategory, checkScroll]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <div className="relative bg-white border-b border-gray-100 py-1.5 md:py-2 select-none shadow-2xs">
      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* Left Arrow Button with Gradient Scrim (Tablet/Desktop) */}
        {canScrollLeft && (
          <div className="slider-arrow-scrim-left hidden sm:flex">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous categories"
              className="slider-nav-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="category-slider-track no-scrollbar touch-pan-x w-full"
        >
          {categories.map((cat) => {
            const isSelected = (selectedCategory || '').toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className={`category-slider-item group ${isSelected ? 'is-selected' : ''}`}
                title={cat.name}
              >
                <div className="category-icon-container">
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="category-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="category-label">{cat.name}</span>
                {isSelected && <span className="category-active-bar" />}
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button with Gradient Scrim (Tablet/Desktop) */}
        {canScrollRight && (
          <div className="slider-arrow-scrim-right hidden sm:flex">
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next categories"
              className="slider-nav-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

