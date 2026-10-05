import React, { useState, useEffect } from 'react';

const heroSlides = [
  {
    image: '/hero-ridge.jpg',
    title: 'Lush Tropical Ridge & Trail Expeditions'
  },
  {
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    title: 'Spiti Snowy Himalayan Valleys'
  },
  {
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    title: 'Bali Island Retreats'
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    title: 'High Altitude Alpine Mountain Passes'
  }
];

// Persona words that cycle
const audienceWords = ['Families', 'Explorers', 'Colleagues', 'Couples', 'Solo Travelers', 'Friends'];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isFadingWord, setIsFadingWord] = useState(false);

  // Auto-advance hero slides
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  // Cycle audience words
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setIsFadingWord(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % audienceWords.length);
        setIsFadingWord(false);
      }, 350);
    }, 2800);
    return () => clearInterval(wordInterval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 select-none">
      {/* Banner Carousel Container - matches exact mobile viewport in user screenshot */}
      <div className="hero-slider-wrapper">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="hero-slide-image filter brightness-[0.94]"
            />
            {/* Subtle top gradient for high text contrast */}
            <div className="hero-overlay-gradient" />
          </div>
        ))}

        {/* Floating Heading Overlay - Exact match to reference screenshot */}
        <div className="hero-heading-box">
          {/* Line 1: Experiences for */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold productSansBold tracking-tight text-white mb-0.5 md:mb-1">
            Experiences for
          </h1>

          {/* Line 2: [Tourist-image] Families */}
          <div className="flex items-center text-3xl sm:text-4xl md:text-5xl font-extrabold productSansBold tracking-tight text-white">
            {/* The exact strike-through Tourist graphic from reference */}
            <img
              loading="eager"
              fetchpriority="high"
              decoding="async"
              src="/tourist-text.png"
              alt="Tourist"
              className="hero-tourist-img"
            />

            {/* Alternating Persona Word - starts on Families */}
            <span
              className={`transition-all duration-300 text-white ${
                isFadingWord ? 'opacity-0 transform -translate-y-1' : 'opacity-100 transform translate-y-0'
              }`}
            >
              {audienceWords[wordIndex]}
            </span>
          </div>
        </div>

        {/* Slide Navigation Dots (Desktop only for clean mobile look matching screenshot) */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-1.5 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === currentSlide
                  ? 'w-6 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
