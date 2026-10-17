import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaCircleCheck } from 'react-icons/fa6';

export default function ReviewCard3D({ review, onReadMore }) {
  const cardRef = useRef(null);

  // Mouse tilt motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  // 3D rotations (-10deg to 10deg)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  // Dynamic glare angle
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="relative review-card-fluid bg-white/95 backdrop-blur-md rounded-3xl p-3 border border-gray-100 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(253,91,1,0.22)] transition-shadow duration-300 flex flex-col justify-between select-none cursor-pointer group"
      onClick={() => onReadMore && onReadMore(review)}
    >
      {/* Dynamic Glass Specular Glare */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`
        }}
      />

      {/* Top Image Container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0"
        style={{ height: '160px', width: '100%', transform: 'translateZ(20px)' }}
      >
        <img
          loading="lazy"
          decoding="async"
          src={review.travelPhoto}
          alt={`${review.name} - ${review.trip}`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80';
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Gradient dark scrim for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Destination Pill Badge */}
        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>{review.trip}</span>
        </div>

        {/* Verified Badge */}
        <div className="absolute top-2.5 right-2.5 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <FaCircleCheck className="w-2.5 h-2.5" />
          <span>Verified</span>
        </div>

        {/* Subtle Quote Icon Accent */}
        <div className="absolute bottom-2.5 right-2.5 text-white/40">
          <FaQuoteLeft className="w-5 h-5" />
        </div>
      </div>

      {/* Body Content */}
      <div
        className="p-2.5 flex flex-col justify-between flex-1"
        style={{ transform: 'translateZ(30px)' }}
      >
        <div>
          {/* Star Rating & Score */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(review.stars || 5)].map((_, i) => (
                  <FaStar key={i} className="w-3.5 h-3.5 fill-current drop-shadow-sm" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800 ml-1">5.0</span>
            </div>
            <span className="text-[11px] font-semibold text-primary group-hover:underline">
              Experience Story →
            </span>
          </div>

          {/* Comment Quote */}
          <p className="text-[12.5px] text-gray-700 leading-relaxed italic line-clamp-3 font-normal">
            "{review.comment}"
          </p>
        </div>

        {/* Reviewer Profile */}
        <div className="flex items-center gap-3 pt-2.5 border-t border-gray-100 mt-2">
          <div className="relative">
            <img
              loading="lazy"
              decoding="async"
              src={review.avatar}
              alt={review.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
              }}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
              {review.name}
            </h4>
            <p className="text-[11px] text-gray-500 truncate flex items-center gap-1">
              <span>{review.trip} Traveler</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
