import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FaPlane,
  FaSnowflake,
  FaSuitcase,
  FaUsers,
  FaHeart,
  FaMotorcycle,
  FaWandMagicSparkles,
  FaPersonHiking,
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaMinus,
  FaStar,
  FaArrowRight,
  FaXmark,
  FaWhatsapp,
  FaArrowLeft,
  FaCircleCheck,
  FaTag
} from 'react-icons/fa6';
import LazyImage from './LazyImage';

export default function DestinationPage({
  destinationData,
  onSelectPackage,
  onNavigateHome,
  onNavigateDestination,
  onOpenEmiModal
}) {
  const [activeCategory, setActiveCategory] = useState(
    destinationData?.categoriesList?.[0]?.id || 'tour_packages'
  );
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [selectedFaqGroup, setSelectedFaqGroup] = useState('All');
  const [openFaqIds, setOpenFaqIds] = useState(new Set());
  const [faqsVisibleCount, setFaqsVisibleCount] = useState(6);
  const [attractionsVisibleCount, setAttractionsVisibleCount] = useState(8);
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);

  const sectionRefs = useRef({});
  const carouselRefs = useRef({});

  // Reset scroll to top on destination change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (destinationData?.categoriesList?.[0]?.id) {
      setActiveCategory(destinationData.categoriesList[0].id);
    }
  }, [destinationData?.slug]);

  // Scroll to section handler
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    const element = sectionRefs.current[categoryId];
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Carousel arrow scroll
  const handleCarouselScroll = (catId, direction) => {
    const el = carouselRefs.current[catId];
    if (el) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // FAQ toggle
  const toggleFaq = (id) => {
    setOpenFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter FAQs by group
  const faqGroups = useMemo(() => {
    const groups = new Set(['All']);
    (destinationData?.faqs || []).forEach((f) => {
      if (f.group) groups.add(f.group);
    });
    return Array.from(groups);
  }, [destinationData?.faqs]);

  const filteredFaqs = useMemo(() => {
    const list = destinationData?.faqs || [];
    if (selectedFaqGroup === 'All') return list;
    return list.filter((f) => f.group === selectedFaqGroup);
  }, [destinationData?.faqs, selectedFaqGroup]);

  // Format currency
  const formatINR = (val) => {
    if (!val || isNaN(val)) return '0';
    return Number(val).toLocaleString('en-IN');
  };

  // Category Icon Resolver
  const renderCategoryIcon = (iconType) => {
    switch (iconType) {
      case 'flight':
        return <FaPlane className="w-4 h-4" />;
      case 'winter':
        return <FaSnowflake className="w-4 h-4 text-cyan-600" />;
      case 'group':
        return <FaUsers className="w-4 h-4 text-amber-600" />;
      case 'honeymoon':
        return <FaHeart className="w-4 h-4 text-rose-500" />;
      case 'bike':
        return <FaMotorcycle className="w-4 h-4 text-orange-500" />;
      case 'unique':
        return <FaWandMagicSparkles className="w-4 h-4 text-purple-600" />;
      default:
        return <FaSuitcase className="w-4 h-4 text-red-500" />;
    }
  };

  const domesticDests = [
    { name: 'Kashmir', slug: 'kashmir' },
    { name: 'Meghalaya', slug: 'meghalaya' },
    { name: 'Spiti Valley', slug: 'spiti-valley' },
    { name: 'Ladakh', slug: 'ladakh' },
    { name: 'Goa', slug: 'goa' },
    { name: 'Kerala', slug: 'kerala' },
    { name: 'Jaisalmer', slug: 'jaisalmer' },
    { name: 'Andaman', slug: 'andaman' }
  ];

  const intlDests = [
    { name: 'Thailand', slug: 'thailand' },
    { name: 'Bali', slug: 'bali' },
    { name: 'Dubai', slug: 'dubai' },
    { name: 'Vietnam', slug: 'vietnam' },
    { name: 'Maldives', slug: 'maldives' },
    { name: 'Malaysia', slug: 'malaysia' },
    { name: 'Georgia', slug: 'georgia' },
    { name: 'Almaty', slug: 'almaty' }
  ];

  const popularCities = ['Delhi', 'Mumbai', 'Ahmedabad', 'Bangalore', 'Pune', 'Kolkata', 'Hyderabad', 'Chennai'];

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-16 font-sans">
      {/* 1. Breadcrumb & Back Header */}
      <div className="bg-[#f8f9fa] border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-gray-500 overflow-x-auto whitespace-nowrap">
            <button
              onClick={onNavigateHome}
              className="hover:text-black transition cursor-pointer font-medium"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-gray-900 font-bold capitalize">
              {destinationData?.name} Tour Packages
            </span>
          </div>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-black font-semibold bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-2xs hover:shadow-xs transition"
          >
            <FaArrowLeft className="w-3 h-3 text-[#ec1d24]" />
            Back to Home
          </button>
        </div>
      </div>

      {/* 2. Destination Banner Title */}
      <div className="bg-gradient-to-b from-[#f8f9fa] to-white border-b border-gray-100 py-6 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#fff1f2] border border-[#fecdd3] text-[#ec1d24] text-xs font-bold px-3 py-1 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ec1d24] animate-pulse"></span>
              Verified Avian Experiences
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight mb-3">
              {destinationData?.heroTitle || `${destinationData?.name} Tour Packages`}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
              {destinationData?.tagline ||
                `Explore hand-crafted itineraries, top-rated stays, and hassle-free private and group experiences in ${destinationData?.name}.`}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Sticky Category Navigation Bar (Avian Experiences exact style) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          {(destinationData?.categoriesList || []).map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#fff1f2] text-[#ec1d24] border-2 border-[#ec1d24] shadow-xs scale-102'
                    : 'bg-white text-gray-700 hover:text-black border border-gray-200 hover:border-gray-300'
                }`}
              >
                {renderCategoryIcon(cat.iconType)}
                <span>{cat.navLabel || cat.title}</span>
              </button>
            );
          })}

          {destinationData?.activities?.length > 0 && (
            <button
              onClick={() => handleCategoryClick('activities')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === 'activities'
                  ? 'bg-[#fff1f2] text-[#ec1d24] border-2 border-[#ec1d24] shadow-xs'
                  : 'bg-white text-gray-700 hover:text-black border border-gray-200'
              }`}
            >
              <FaPersonHiking className="w-4 h-4 text-emerald-600" />
              <span>Activities</span>
            </button>
          )}

          {destinationData?.attractions?.length > 0 && (
            <button
              onClick={() => handleCategoryClick('attractions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === 'attractions'
                  ? 'bg-[#fff1f2] text-[#ec1d24] border-2 border-[#ec1d24] shadow-xs'
                  : 'bg-white text-gray-700 hover:text-black border border-gray-200'
              }`}
            >
              <FaCamera className="w-4 h-4 text-blue-600" />
              <span>Attractions</span>
            </button>
          )}

          {destinationData?.faqs?.length > 0 && (
            <button
              onClick={() => handleCategoryClick('faqs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === 'faqs'
                  ? 'bg-[#fff1f2] text-[#ec1d24] border-2 border-[#ec1d24] shadow-xs'
                  : 'bg-white text-gray-700 hover:text-black border border-gray-200'
              }`}
            >
              <span>FAQs</span>
            </button>
          )}

          {destinationData?.reviews?.length > 0 && (
            <button
              onClick={() => handleCategoryClick('reviews')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === 'reviews'
                  ? 'bg-[#fff1f2] text-[#ec1d24] border-2 border-[#ec1d24] shadow-xs'
                  : 'bg-white text-gray-700 hover:text-black border border-gray-200'
              }`}
            >
              <FaStar className="w-4 h-4 text-amber-500" />
              <span>Travellers Reviews</span>
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16 mt-8">
        {/* 4. Package Categories Carousels */}
        {(destinationData?.categoriesList || []).map((cat) => {
          const packages = destinationData?.packagesByCategory?.[cat.id] || [];
          if (packages.length === 0) return null;

          return (
            <section
              key={cat.id}
              id={cat.id}
              ref={(el) => (sectionRefs.current[cat.id] = el)}
              className="scroll-mt-24 pt-4 border-b border-gray-100 pb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-950 flex items-center gap-2.5">
                    {renderCategoryIcon(cat.iconType)}
                    <span>{cat.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {packages.length} curated {packages.length === 1 ? 'package' : 'packages'} available
                  </p>
                </div>

                {/* Left / Right Carousel Controls */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => handleCarouselScroll(cat.id, 'left')}
                    aria-label="Previous"
                    className="w-9 h-9 rounded-full bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black shadow-xs transition cursor-pointer"
                  >
                    <FaChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCarouselScroll(cat.id, 'right')}
                    aria-label="Next"
                    className="w-9 h-9 rounded-full bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black shadow-xs transition cursor-pointer"
                  >
                    <FaChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Package Cards Slider Track */}
              <div
                ref={(el) => (carouselRefs.current[cat.id] = el)}
                className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 px-1 scroll-smooth"
              >
                {packages.map((pkg) => (
                  <div
                    key={pkg.id || pkg.slug}
                    onClick={() => onSelectPackage(pkg)}
                    className="flex-shrink-0 w-[290px] sm:w-[340px] bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1"
                  >
                    {/* Card Cover Image with Badges */}
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-100">
                      <img
                        loading="lazy"
                        src={pkg.coverImage || pkg.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                        alt={pkg.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        <span className="bg-black/65 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                          {pkg.duration}
                        </span>
                        {pkg.flightIncluded && (
                          <span className="bg-[#0284c7] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <FaPlane className="w-2.5 h-2.5" /> Flight Included
                          </span>
                        )}
                      </div>

                      {pkg.saveAmount > 0 && (
                        <div className="absolute top-3 right-3 bg-[#e9fee5] border border-[#58e458] text-[#15803d] text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <FaTag className="w-2.5 h-2.5" /> Save ₹{formatINR(pkg.saveAmount)}
                        </div>
                      )}

                      {/* Category Badge on Bottom Left of Image */}
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/95 backdrop-blur-md text-gray-900 text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                          {pkg.categoryBadge || (pkg.type === 'group' ? 'Group Trip' : 'Private Tour')}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h3 className="font-bold text-gray-950 text-base sm:text-lg line-clamp-1 group-hover:text-[#ec1d24] transition-colors">
                          {pkg.name}
                        </h3>

                        {/* Tagline */}
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {pkg.tagline || pkg.subtitle || 'All-inclusive curated experience'}
                        </p>

                        {/* Rating row */}
                        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-gray-600">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="font-black text-gray-900">4.9</span>
                          <span className="text-gray-400">({pkg.reviews?.length || 24} reviews)</span>
                        </div>
                      </div>

                      {/* Pricing Section */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between">
                        <div>
                          {pkg.originalPrice > pkg.price && (
                            <span className="text-xs text-gray-400 line-through block">
                              ₹{formatINR(pkg.originalPrice)}
                            </span>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs text-gray-500 font-medium">Starts from</span>
                            <span className="text-lg sm:text-xl font-black text-[#ec1d24]">
                              ₹{formatINR(pkg.price)}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold block">
                            No Cost EMI available
                          </span>
                        </div>

                        <button
                          type="button"
                          className="bg-gray-950 group-hover:bg-[#ec1d24] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-1 shadow-2xs"
                        >
                          View Details
                          <FaArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* 5. About Destination Box (Exact Avian Experiences Style) */}
        {destinationData?.about && (
          <section className="bg-[#f8f9fa] rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-3">
              About {destinationData?.name}
            </h2>
            <div className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
              {destinationData?.about}
            </div>
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="mt-3 text-sm font-bold text-[#ec1d24] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              Read Full Overview ↗
            </button>
          </section>
        )}

        {/* 6. Activities Section (if available) */}
        {destinationData?.activities?.length > 0 && (
          <section
            id="activities"
            ref={(el) => (sectionRefs.current['activities'] = el)}
            className="scroll-mt-24 pt-4 border-b border-gray-100 pb-12"
          >
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-950 flex items-center gap-2">
                <FaPersonHiking className="w-5 h-5 text-emerald-600" />
                Activities in {destinationData?.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Top adventure and leisure things to do in {destinationData?.name}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {destinationData.activities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  <div className="h-44 w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={act.image}
                      alt={act.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-108 duration-500"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {act.duration}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-950 text-sm sm:text-base group-hover:text-[#ec1d24] transition-colors line-clamp-2">
                        {act.name}
                      </h3>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      {act.price ? (
                        <div>
                          {act.originalPrice > act.price && (
                            <span className="text-[11px] text-gray-400 line-through block">
                              ₹{formatINR(act.originalPrice)}
                            </span>
                          )}
                          <span className="text-sm font-black text-[#ec1d24]">
                            ₹{formatINR(act.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 font-semibold">Included in tour</span>
                      )}
                      <a
                        href="https://wa.me/919548436762?text=Hello,%20I%20am%20interested%20in%20activities."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 hover:bg-[#ec1d24] hover:text-white text-gray-800 p-2 rounded-full transition-colors"
                      >
                        <FaArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Attractions Grid Section */}
        {destinationData?.attractions?.length > 0 && (
          <section
            id="attractions"
            ref={(el) => (sectionRefs.current['attractions'] = el)}
            className="scroll-mt-24 pt-4 border-b border-gray-100 pb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-950 flex items-center gap-2">
                  <FaCamera className="w-5 h-5 text-blue-600" />
                  Popular Attractions in {destinationData?.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Must-visit sightseeing points and iconic landmarks
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {destinationData.attractions.slice(0, attractionsVisibleCount).map((att) => (
                <div
                  key={att.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col"
                >
                  <div className="h-40 sm:h-48 w-full overflow-hidden bg-gray-100 relative">
                    <img
                      loading="lazy"
                      src={att.image}
                      alt={att.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-108 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-3">
                      <h3 className="text-white font-black text-xs sm:text-sm leading-tight line-clamp-1">
                        {att.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {att.brief || att.description || 'Scenic highlight visited on our tour.'}
                    </p>
                    <span className="text-[11px] font-bold text-[#ec1d24] mt-2 inline-flex items-center gap-1">
                      Explore in package →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {attractionsVisibleCount < destinationData.attractions.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setAttractionsVisibleCount((prev) => prev + 8)}
                  className="px-6 py-2 rounded-full border border-gray-300 text-xs sm:text-sm font-bold text-gray-700 hover:text-black hover:border-black transition cursor-pointer"
                >
                  Load More Attractions ({destinationData.attractions.length - attractionsVisibleCount} remaining)
                </button>
              </div>
            )}
          </section>
        )}

        {/* 8. FAQs Accordion Section */}
        {destinationData?.faqs?.length > 0 && (
          <section
            id="faqs"
            ref={(el) => (sectionRefs.current['faqs'] = el)}
            className="scroll-mt-24 pt-4 border-b border-gray-100 pb-12"
          >
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-950">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Everything you need to know before booking your {destinationData?.name} trip
              </p>
            </div>

            {/* FAQ Group Tabs */}
            {faqGroups.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
                {faqGroups.map((grp) => (
                  <button
                    key={grp}
                    onClick={() => {
                      setSelectedFaqGroup(grp);
                      setFaqsVisibleCount(6);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedFaqGroup === grp
                        ? 'bg-[#ec1d24] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>
            )}

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.slice(0, faqsVisibleCount).map((f) => {
                const isOpen = openFaqIds.has(f.id);
                return (
                  <div
                    key={f.id}
                    className="border border-gray-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(f.id)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-gray-900 hover:text-[#ec1d24] transition-colors cursor-pointer"
                    >
                      <span>{f.question}</span>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[#ec1d24]">
                        {isOpen ? <FaMinus className="w-3 h-3" /> : <FaPlus className="w-3 h-3" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#fafafa]">
                        <p>{f.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {faqsVisibleCount < filteredFaqs.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setFaqsVisibleCount((prev) => prev + 6)}
                  className="px-6 py-2 rounded-full border border-gray-300 text-xs sm:text-sm font-bold text-gray-700 hover:text-black hover:border-black transition cursor-pointer"
                >
                  Load More Questions
                </button>
              </div>
            )}
          </section>
        )}

        {/* 9. Travellers Reviews Section (Exact Avian Experiences Style) */}
        {destinationData?.reviews?.length > 0 && (
          <section
            id="reviews"
            ref={(el) => (sectionRefs.current['reviews'] = el)}
            className="scroll-mt-24 pt-4 pb-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-950 flex items-center gap-2">
                  <FaStar className="w-5 h-5 text-amber-500 fill-current" />
                  Travellers Reviews
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Verified stories and experiences from travellers who booked {destinationData?.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {destinationData.reviews.slice(0, 10).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* User Header */}
                    <div className="flex items-center gap-3 mb-3">
                      {rev.user_photo ? (
                        <img
                          src={rev.user_photo}
                          alt={rev.user_name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ec1d24] to-pink-500 text-white font-black flex items-center justify-center text-base">
                          {rev.user_name?.charAt(0) || 'U'}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-gray-950 truncate">
                            {rev.user_name}
                          </span>
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Verified Guest
                          </span>
                        </div>

                        {rev.trek?.name && (
                          <p className="text-xs text-gray-500 truncate">
                            Booked:{' '}
                            <span className="font-semibold text-gray-800">
                              {rev.trek.name}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Star Rating & Date */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {rev.publish_date ? new Date(rev.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent traveler'}
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                      "{rev.review}"
                    </p>
                  </div>

                  {/* Review photos grid */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-100">
                      {rev.images.slice(0, 3).map((imgUrl, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedReviewImage(imgUrl)}
                          className="h-20 rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition"
                        >
                          <img
                            src={imgUrl}
                            alt="Traveler review"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 10. SEO Destination Links Section */}
        <section className="border-t border-gray-200 pt-10 space-y-8">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
              {destinationData?.name} Tour Packages from Popular Cities
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularCities.map((city) => (
                <span
                  key={city}
                  className="text-xs px-3.5 py-1.5 rounded-full border border-gray-200 text-gray-700 bg-gray-50/50"
                >
                  {destinationData?.name} Tour Packages from {city}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
              Popular Domestic Destinations
            </h3>
            <div className="flex flex-wrap gap-2">
              {domesticDests.map((d) => (
                <button
                  key={d.slug}
                  onClick={() => onNavigateDestination && onNavigateDestination(d.slug)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition cursor-pointer ${
                    destinationData?.slug === d.slug
                      ? 'border-[#ec1d24] text-[#ec1d24] font-bold bg-[#fff1f2]'
                      : 'border-gray-200 text-gray-700 hover:border-black bg-white'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
              Popular International Destinations
            </h3>
            <div className="flex flex-wrap gap-2">
              {intlDests.map((d) => (
                <button
                  key={d.slug}
                  onClick={() => onNavigateDestination && onNavigateDestination(d.slug)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition cursor-pointer ${
                    destinationData?.slug === d.slug
                      ? 'border-[#ec1d24] text-[#ec1d24] font-bold bg-[#fff1f2]'
                      : 'border-gray-200 text-gray-700 hover:border-black bg-white'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* About Full Story Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <FaXmark className="w-4 h-4" />
            </button>
            <h2 className="text-2xl font-black text-gray-950 mb-4">
              About {destinationData?.name}
            </h2>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {destinationData?.about}
            </div>
          </div>
        </div>
      )}

      {/* Review Image Preview Modal */}
      {selectedReviewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedReviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={selectedReviewImage}
              alt="Review preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            />
            <button
              onClick={() => setSelectedReviewImage(null)}
              className="absolute -top-3 -right-3 bg-white text-black p-2 rounded-full shadow-lg"
            >
              <FaXmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
