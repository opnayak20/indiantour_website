import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaCircleCheck,
  FaQuoteLeft,
  FaXmark,
  FaWhatsapp
} from 'react-icons/fa6';
import { reviews } from '../data/websiteData';
import { API_BASE } from '../config/api';
import ThreeReviewsCanvas from './ThreeReviewsCanvas';
import ReviewCard3D from './ReviewCard3D';

export default function ReviewsSection({ onViewAllReviews }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewsList, setReviewsList] = useState(reviews);

  useEffect(() => {
    fetch(`${API_BASE}/admin/testimonials.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && Array.isArray(data.data?.testimonials) && data.data.testimonials.length > 0) {
          const mapped = data.data.testimonials.map((t, idx) => ({
            id: t.id || idx + 1,
            name: t.name,
            trip: t.trip || 'Tour Package',
            stars: t.rating || 5,
            comment: t.quote,
            travelPhoto: 'https://images.unsplash.com/photo-1653844573020-71f77a0ccb8c?auto=format&fit=crop&w=500&q=80',
            avatar: t.avatar || (t.name ? t.name.slice(0, 2).toUpperCase() : 'IT')
          }));
          setReviewsList(mapped);
        }
      })
      .catch(() => {});
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
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 320);
    }
  };

  return (
    <section className="reviews-section relative overflow-hidden bg-gradient-to-b from-white via-red-50/20 to-white">
      {/* 3D WebGL Three.js Particle Canvas Background */}
      <ThreeReviewsCanvas />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Trust Badges Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100"
        >
          <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/80 px-3 py-1.5 rounded-full">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-800">4.9 / 5.0</span>
            <span className="text-[11px] text-gray-500 hidden xs:inline">· 2,800+ Verified Ratings</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
              <FaCircleCheck className="w-3 h-3 text-emerald-600" />
              100% Genuine Travelers
            </span>
            <span className="hidden sm:inline text-gray-500">
              ✨ 25,000+ Happy Explorers
            </span>
          </div>
        </motion.div>

        {/* Section Header (Avian Experiences exact style) */}
        <div className="pb-4 sm:pb-6 productSansBold flex flex-col sm:flex-row sm:items-end justify-between gap-3.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#e52b2b] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#e52b2b]">
                Real Experiences
              </span>
            </div>
            <h2 className="md:text-3xl text-xl sm:text-2xl ProductSans font-extrabold text-gray-900 tracking-tight">
              What our travelers say about us
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Over 25,000+ happy travelers explored the most beautiful corners of India with us
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onViewAllReviews}
            className="self-start sm:self-auto flex-shrink-0 text-xs sm:text-sm md:text-base flex items-center gap-1.5 text-gray-800 hover:text-black font-bold cursor-pointer group bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-all shadow-2xs"
          >
            <span>View All Reviews</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </motion.button>
        </div>

        {/* Carousel Container with Framer Motion Navigation */}
        <div className="relative">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleScroll('left')}
              aria-label="Previous reviews"
              className="absolute top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 shadow-xl border border-gray-200 rounded-full p-3 z-30 -left-3 md:-left-5 hidden md:flex items-center justify-center cursor-pointer transition-colors"
            >
              <FaChevronLeft className="w-4 h-4 text-gray-700 hover:text-primary" />
            </motion.button>
          )}

          {/* Scrollable Reviews Cards Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto no-scrollbar space-x-6 py-4 px-1 w-full scroll-smooth"
            style={{ perspective: 1200 }}
          >
            {reviewsList.map((rev) => (
              <ReviewCard3D
                key={rev.id}
                review={rev}
                onReadMore={(r) => setSelectedReview(r)}
              />
            ))}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleScroll('right')}
              aria-label="Next reviews"
              className="absolute top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 shadow-xl border border-gray-200 rounded-full p-3 z-30 -right-3 md:-right-5 hidden md:flex items-center justify-center cursor-pointer transition-colors"
            >
              <FaChevronRight className="w-4 h-4 text-gray-700 hover:text-primary" />
            </motion.button>
          )}
        </div>

      </div>

      {/* Interactive Detail Modal with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 25, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto my-auto shadow-2xl relative border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedReview(null)}
                aria-label="Close review modal"
                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 backdrop-blur-md transition-colors cursor-pointer"
              >
                <FaXmark className="w-4 h-4" />
              </button>

              {/* Modal Top Image */}
              <div
                className="relative w-full overflow-hidden flex-shrink-0"
                style={{ height: '210px', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#1a1a1a' }}
              >
                <img
                  src={selectedReview.travelPhoto}
                  alt={selectedReview.trip}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
                />
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span
                      className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
                      style={{ backgroundColor: '#ec1d24' }}
                    >
                      📍 {selectedReview.trip}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1.5 productSansBold">
                      {selectedReview.name}'s Experience
                    </h3>
                  </div>

                  <div className="flex gap-1" style={{ color: '#f59e0b' }}>
                    {[...Array(selectedReview.stars || 5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                  <img
                    src={selectedReview.avatar}
                    alt={selectedReview.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
                    }}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                    style={{ border: '2px solid #fd5b01' }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{selectedReview.name}</span>
                      <FaCircleCheck className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                    </h4>
                    <p className="text-xs text-gray-500">
                      Verified Traveler · {selectedReview.trip} Expedition
                    </p>
                  </div>
                </div>

                <div className="relative pl-6 italic text-gray-700 text-sm leading-relaxed mb-6">
                  <FaQuoteLeft className="w-4 h-4 absolute top-0 left-0" style={{ color: '#fd5b01', opacity: 0.5 }} />
                  "{selectedReview.comment}"
                </div>

                {/* WhatsApp Action to Book Same Trip */}
                <a
                  href={`https://wa.me/919548436762?text=${encodeURIComponent(
                    `Hi India Tour! I loved ${selectedReview.name}'s review of the ${selectedReview.trip}. Can you share package details for this?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-white font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                  style={{ backgroundColor: '#25d366', color: '#ffffff' }}
                >
                  <FaWhatsapp className="w-5 h-5 text-white" />
                  <span>Enquire About {selectedReview.trip}</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
