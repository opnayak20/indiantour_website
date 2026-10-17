import React, { useState, useEffect, useRef, useCallback } from 'react';
import { tourPackageDestinations } from '../data/tourPackagesData';
import { categories } from '../data/categoriesData';
import { API_BASE } from '../config/api';
import LazyImage from './LazyImage';

// Individual Tour Package Card matching avianexperiences.com design
function TourCard({ pkg, onCardClick }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const prevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? pkg.images.length - 1 : prev - 1));
  };

  const nextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === pkg.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      onClick={() => onCardClick(pkg)}
      className="lazy-card-item group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden cursor-pointer select-none"
    >
      {/* Top Card Image with dots and hover arrows */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        <LazyImage
          src={pkg.images[activeImgIdx]}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Arrow Controls */}
        {pkg.images && pkg.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImg}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextImg}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {pkg.images && pkg.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {pkg.images.map((_, i) => (
              <span
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIdx(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  i === activeImgIdx ? 'w-3 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Info Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Duration */}
          <p className="text-[11px] sm:text-xs font-semibold text-gray-400 tracking-normal mb-1">
            {pkg.duration}
          </p>

          {/* Title */}
          <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 group-hover:text-[#ec1d24] transition-colors line-clamp-1 leading-snug">
            {pkg.title}
          </h3>

          {/* Key Inclusions / Highlights */}
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {pkg.highlights || pkg.route}
          </p>
        </div>

        <div className="mt-2.5 pt-1">
          {/* Green Savings Badge (Avian Experiences exact style) */}
          {pkg.badge && (
            <div className="inline-flex items-center gap-1 bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-2 py-0.5 rounded text-[11px] font-bold tracking-tight">
              <svg className="w-3 h-3 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{pkg.badge}</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-extrabold text-gray-950 font-sans tracking-tight">
              ₹ {pkg.price?.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              /individual
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TourPackagesPage({ onPackageSelect }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug || 'meghalaya');
  const [destinationsList, setDestinationsList] = useState(tourPackageDestinations);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Sync any admin-created packages if available from backend
  useEffect(() => {
    fetch(`${API_BASE}/admin/tours.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          // Merge API packages by destination category
          setDestinationsList((prevList) => {
            const updated = [...prevList];
            data.data.forEach((apiTour) => {
              const destSlug = (apiTour.category || apiTour.destination || '').toLowerCase();
              const destObj = updated.find((d) => d.slug === destSlug);
              if (destObj) {
                if (!destObj.packages.some((p) => p.id === apiTour.id || p.slug === apiTour.slug)) {
                  destObj.packages.push({
                    id: apiTour.id,
                    slug: apiTour.slug || `tour-${apiTour.id}`,
                    destination: destSlug,
                    title: apiTour.title,
                    duration: apiTour.duration || '6 Days 5 Nights',
                    highlights: apiTour.route || apiTour.highlights || 'Curated sightseeing',
                    badge: apiTour.badge || 'SAVE ₹4,000',
                    price: apiTour.price,
                    originalPrice: apiTour.originalPrice || apiTour.price + 4000,
                    images: Array.isArray(apiTour.images) && apiTour.images.length > 0 ? apiTour.images : [apiTour.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
                    overview: apiTour.overview,
                    inclusions: apiTour.inclusions || []
                  });
                }
              }
            });
            return updated;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Check scroll position for icon bar
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

  const handleScrollIcons = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  // Scroll to destination section when icon clicked
  const scrollToDestination = (slug) => {
    setActiveCategory(slug);
    const elem = document.getElementById(`${slug}-tour-packages`);
    if (elem) {
      const navOffset = 130; // accounts for navbar + sticky category bar
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // IntersectionObserver to highlight active category in top slider as user scrolls
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const destSlug = entry.target.getAttribute('data-dest-slug');
          if (destSlug) {
            setActiveCategory(destSlug);
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('[data-dest-slug]');
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, [destinationsList]);

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Sub-Header: Destination Icons Slider (Sticky below Navbar) */}
      <div className="sticky top-[52px] sm:top-[60px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-2 select-none transition-shadow">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <div className="slider-arrow-scrim-left hidden sm:flex items-center">
              <button
                type="button"
                onClick={() => handleScrollIcons('left')}
                aria-label="Previous destinations"
                className="slider-nav-btn cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="category-slider-track no-scrollbar touch-pan-x w-full flex items-center gap-6 sm:gap-8 overflow-x-auto"
          >
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => scrollToDestination(cat.slug)}
                  className={`category-slider-item group flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer pb-1 transition-all ${
                    isSelected ? 'is-selected opacity-100' : 'opacity-75 hover:opacity-100'
                  }`}
                  title={cat.name}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform group-hover:scale-110">
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span className={`text-[11px] sm:text-xs whitespace-nowrap transition-colors ${
                    isSelected ? 'font-bold text-gray-950' : 'font-medium text-gray-600 group-hover:text-gray-950'
                  }`}>
                    {cat.name}
                  </span>
                  {isSelected && (
                    <span className="w-full h-[2px] bg-gray-950 rounded-full mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          {canScrollRight && (
            <div className="slider-arrow-scrim-right hidden sm:flex items-center">
              <button
                type="button"
                onClick={() => handleScrollIcons('right')}
                aria-label="Next destinations"
                className="slider-nav-btn cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 2. Main Tour Packages Grouped by Destination */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-14">
        {destinationsList.map((destination) => (
          <section
            key={destination.slug}
            id={`${destination.slug}-tour-packages`}
            data-dest-slug={destination.slug}
            className="scroll-mt-36"
          >
            {/* Destination Title (e.g. "Meghalaya Tour Packages") */}
            <div className="mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-950 font-sans tracking-tight">
                {destination.title}
              </h2>
            </div>

            {/* Packages Grid: 4-5 cards per row on desktop, wrapping or clean spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {destination.packages.map((pkg) => (
                <TourCard
                  key={pkg.id || pkg.slug}
                  pkg={pkg}
                  onCardClick={onPackageSelect}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
