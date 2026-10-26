import React from 'react';
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
import { useCmsData } from '../data/cmsData';

export default function SearchBar({ searchQuery, setSearchQuery, onQuickSelect }) {
  const homepageCms = useCmsData('homepage');
  const searchConfig = homepageCms?.search;

  const popularSearches = searchConfig?.quickTags && searchConfig.quickTags.length > 0
    ? searchConfig.quickTags
    : [
        'Spiti Valley',
        'Meghalaya',
        'Leh Ladakh',
        'Kashmir',
        'Bali',
        'Vietnam',
        'Kedarnath',
        'Jaisalmer'
      ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-30">
      <div className="bg-white rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-xl border border-gray-200/80 flex flex-col sm:flex-row items-center gap-2">
        
        {/* Search Input Box */}
        <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-1">
          <FaMagnifyingGlass className="w-4 h-4 text-[#ec1d24] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchConfig?.placeholder || "Search tours, destinations or experiences (e.g. Spiti, Meghalaya, Ladakh)..."}
            className="w-full bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none productSans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
              aria-label="Clear search"
            >
              <FaXmark className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Action Button */}
        <button
          type="button"
          onClick={() => {
            const elem = document.getElementById('trending-section');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full sm:w-auto bg-primary text-white font-bold px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full text-xs sm:text-sm whitespace-nowrap shadow-md hover:opacity-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          style={{ backgroundColor: '#ec1d24', color: '#ffffff' }}
        >
          <span>Find Trips</span>
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Quick Trend Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 px-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
          Trending:
        </span>
        {popularSearches.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onQuickSelect(chip)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              searchQuery.toLowerCase() === chip.toLowerCase()
                ? 'bg-[#2b2b2b] text-white font-semibold'
                : 'bg-white/80 hover:bg-white text-gray-700 hover:text-black border border-gray-200/80 shadow-2xs font-medium'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
