import React, { useRef, useState, useEffect } from 'react';
import { trendingPackages } from '../data/websiteData';
import { API_BASE } from '../config/api';

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
      className="trending-card lazy-card-item cursor-pointer group pb-2 select-none"
    >
      {/* Top Image Slider Card */}
      <div 
        className="rounded-3xl relative shadow-md overflow-hidden bg-gray-100 z-10 transition-transform duration-300 group-hover:shadow-xl trending-card-img-box"
      >
        <div className="relative w-full h-full overflow-hidden">
          <img
            loading="lazy"
            decoding="async"
            src={pkg.images[activeImageIndex]}
            alt={`${pkg.title} - Slide ${activeImageIndex + 1}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Left Arrow Button for card images */}
          {pkg.images && pkg.images.length > 1 && (
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-7 h-7 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
              style={{ left: '10px' }}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12.7 15.3a1 1 0 01-1.4 0l-5-5a1 1 0 010-1.4l5-5a1 1 0 111.4 1.4L8.41 10l4.3 4.3a1 1 0 010 1.4z" />
              </svg>
            </button>
          )}

          {/* Right Arrow Button for card images */}
          {pkg.images && pkg.images.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-7 h-7 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
              style={{ right: '10px' }}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.3 4.7a1 1 0 011.4 0l5 5a1 1 0 010 1.4l-5 5a1 1 0 01-1.4-1.4L11.59 10 7.3 5.7a1 1 0 010-1.4z" />
              </svg>
            </button>
          )}

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

      {/* Bottom Info Details Card - responsive uniform height */}
      <div 
        className="bg-white rounded-b-3xl shadow-lg border border-gray-100 p-4 -mt-3 pt-5 relative z-0 flex flex-col justify-between trending-card-info-box"
        style={{ boxSizing: 'border-box' }}
      >
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 truncate">
            {pkg.duration}
          </p>
          <h3 
            className="font-bold productSansBold text-base text-gray-900 leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2"
            style={{ height: '44px', minHeight: '44px' }}
          >
            {pkg.title}
          </h3>
          <p className="text-xs text-gray-500 truncate mb-2">
            {pkg.route}
          </p>
        </div>

        {/* Price & Savings Badges */}
        <div className="border-t border-gray-100 pt-2.5 mt-auto">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap" style={{ minHeight: '22px' }}>
            {pkg.badge && (
              <span 
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1"
                style={{
                  backgroundColor: pkg.badge === 'Early Bird' ? '#EBF5FE' : '#ecfdf5',
                  borderColor: pkg.badge === 'Early Bird' ? '#89C1FB' : '#a7f3d0',
                  color: pkg.badge === 'Early Bird' ? '#1d4ed8' : '#10b981'
                }}
              >
                {pkg.badge.startsWith('Save') ? `✓ ${pkg.badge}` : pkg.badge}
              </span>
            )}
            {pkg.secondaryBadge && (
              <span 
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1"
                style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#10b981' }}
              >
                {pkg.secondaryBadge.startsWith('Save') ? `✓ ${pkg.secondaryBadge}` : pkg.secondaryBadge}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-gray-950 productSansBold text-lg md:text-xl font-extrabold">
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

export default function TrendingSection({ onPackageSelect, searchQuery = '', selectedCategory = null, onClearFilter }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [packagesList, setPackagesList] = useState(trendingPackages);

  useEffect(() => {
    fetch(`${API_BASE}/admin/packages.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && Array.isArray(data.data?.packages) && data.data.packages.length > 0) {
          const mapped = data.data.packages.map((p, index) => {
            const rawImages = Array.isArray(p.gallery) && p.gallery.length > 0
              ? p.gallery
              : (p.image ? [p.image] : []);
            
            const fallbackImages = [
              'https://images.unsplash.com/photo-1653844573020-71f77a0ccb8c?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
            ];

            const numPrice = p.basePriceNum || parseInt(String(p.price || '').replace(/[^0-9]/g, '')) || 19999;
            const numOriginal = parseInt(String(p.priceOriginal || '').replace(/[^0-9]/g, '')) || (numPrice + 4000);

            return {
              id: p.id || index + 1,
              title: p.title,
              route: p.location || p.overview?.slice(0, 60) || 'Scenic adventure & tour route',
              duration: p.duration || '6 Days 5 Nights',
              price: numPrice,
              originalPrice: numOriginal,
              badge: p.badge || (p.featured ? 'Featured' : 'Trending'),
              secondaryBadge: p.featured ? 'Save 4,000' : null,
              images: rawImages.length > 0 ? rawImages : fallbackImages
            };
          });
          setPackagesList(mapped);
        }
      })
      .catch(() => {
        // Fall back to static dataset if backend is unreachable
      });
  }, []);

  // Filter packages based on active search query or category
  const filteredPackages = packagesList.filter((pkg) => {
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (pkg.title || '').toLowerCase().includes(q);
      const matchRoute = (pkg.route || '').toLowerCase().includes(q);
      if (!matchTitle && !matchRoute) return false;
    }
    if (selectedCategory) {
      const cat = selectedCategory.toLowerCase().replace(/-/g, ' ');
      const matchTitle = (pkg.title || '').toLowerCase().includes(cat);
      const matchRoute = (pkg.route || '').toLowerCase().includes(cat);
      if (!matchTitle && !matchRoute) return false;
    }
    return true;
  });

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [filteredPackages]);

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
      <div className="pb-4 px-4 productSansBold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="md:text-2xl text-xl ProductSans font-bold text-gray-900">
            {searchQuery || selectedCategory ? 'Filtered Experiences' : 'Trending'}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-normal">
            Handcrafted routes with confirmed departures
          </p>
        </div>

        {(searchQuery || selectedCategory) && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Filter: {searchQuery || selectedCategory}
            </span>
            <button
              type="button"
              onClick={onClearFilter}
              className="text-xs font-bold text-[#ec1d24] hover:underline cursor-pointer"
            >
              Clear Filter ✕
            </button>
          </div>
        )}
      </div>

      {filteredPackages.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 rounded-3xl mx-4 border border-gray-100">
          <p className="text-base font-bold text-gray-800">
            No tours found matching &quot;{searchQuery || selectedCategory}&quot;
          </p>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Try searching for Spiti, Ladakh, Meghalaya, Bali, Kashmir or browse all tours.
          </p>
          <button
            type="button"
            onClick={onClearFilter}
            className="bg-[#2b2b2b] text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer hover:bg-black transition"
          >
            Show All Tours
          </button>
        </div>
      ) : (

      <div className="flex relative">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Previous packages"
            className="absolute bg-white shadow-xl hover:bg-gray-50 border border-gray-200 rounded-full p-2.5 z-20 -left-2 md:-left-5 hidden md:flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            style={{ top: '107px', transform: 'translateY(-50%)' }}
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
          className="flex overflow-x-auto no-scrollbar touch-pan-x space-x-4 sm:space-x-5 py-2 w-full scroll-smooth px-4 md:px-0"
        >
          {filteredPackages.map((pkg) => (
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
            className="absolute bg-white shadow-xl hover:bg-gray-50 border border-gray-200 rounded-full p-2.5 z-20 -right-2 md:-right-5 hidden md:flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            style={{ top: '107px', transform: 'translateY(-50%)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      )}
    </section>
  );
}
