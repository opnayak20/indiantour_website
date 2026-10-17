import React, { useState, useEffect } from 'react';

const heroSlides = [
  {
    image: '/hero-buddha.jpg',
    title: 'Spiti Valley Buddha Statue & Snowy Himalayan Peaks'
  },
  {
    image: 'https://images.unsplash.com/photo-1653844573020-71f77a0ccb8c?auto=format&fit=crop&w=2560&h=1440&q=90',
    title: 'Spiti Valley & Key Monastery Expedition'
  },
  {
    image: '/hero-ridge.jpg',
    title: 'Lush Tropical Ridge & Trail Expeditions'
  },
  {
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2560&h=1440&q=90',
    title: 'Paradise on Earth - Kashmir Valley'
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&h=1440&q=90',
    title: 'High Altitude Alpine Mountain Passes'
  }
];

// Persona words that cycle - starts on Travellers matching reference
const audienceWords = ['Travellers', 'Adventurers', 'Explorers', 'Families', 'Couples', 'Solo Travelers', 'Friends'];

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
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchPriority={idx === 0 ? 'high' : 'auto'}
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&h=1440&q=90';
              }}
              className="hero-slide-image"
            />
            {/* Subtle top gradient for high text contrast */}
            <div className="hero-overlay-gradient" />
          </div>
        ))}

        {/* Floating Heading Overlay - Exact match to reference with full mobile responsiveness */}
        <div className="hero-heading-box">
          {/* Line 1: Experiences for */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold productSansBold tracking-tight text-white mb-1">
            Experiences for
          </h1>

          {/* Line 2: [Tourist-image] Families */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-2xl sm:text-4xl md:text-5xl font-extrabold productSansBold tracking-tight text-white">
            {/* The exact strike-through Tourist graphic */}
            <img
              loading="eager"
              fetchPriority="high"
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
