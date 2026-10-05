import React, { useRef, useState, useEffect } from 'react';
import { watchAndRead } from '../data/websiteData';

export default function WatchAndRead({ onStorySelect }) {
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
      const scrollAmount = 310;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="bg-[#ebebeb] md:bg-grey py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Heading */}
        <div className="pb-4 md:pt-2 productSansBold flex items-center justify-between">
          <h2 className="md:text-2xl text-xl ProductSans font-bold text-gray-900">
            Watch &amp; Read
          </h2>
          <span className="text-xs md:text-sm text-gray-600">
            Stories, guides & tips
          </span>
        </div>

        <div className="flex relative">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous articles"
              className="absolute top-1/2 transform -translate-y-1/2 bg-white shadow-xl hover:bg-gray-50 border border-gray-200 rounded-full p-2.5 z-20 -left-4 hidden md:flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Cards Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto no-scrollbar space-x-6 py-3 w-full scroll-smooth"
          >
            {watchAndRead.map((story) => (
              <div
                key={story.id}
                onClick={() => onStorySelect(story)}
                className="bg-white shadow-md hover:shadow-2xl rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
                style={{ width: '287px', height: '265px' }}
              >
                {/* Cover Image */}
                <div className="relative w-full h-[163px] overflow-hidden bg-gray-100">
                  <img
                    loading="lazy"
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Share/Bookmark icon badge */}
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md rounded-full p-1.5 text-white">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>

                {/* Author & Story Title */}
                <div className="flex px-3.5 py-3 flex-1 items-center gap-3">
                  <img
                    loading="lazy"
                    src={story.authorAvatar}
                    alt={story.author}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {story.title}
                    </h3>
                    <div className="flex justify-between items-center pt-1 text-gray-500 text-[11px]">
                      <span className="truncate">by {story.author}</span>
                      <span className="whitespace-nowrap ml-2">{story.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next articles"
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
