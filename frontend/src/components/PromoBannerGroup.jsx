import React from 'react';
import { promoBanners } from '../data/websiteData';

export default function PromoBannerGroup({ onBannerClick }) {
  const banner = promoBanners.groupTrips;

  return (
    <div className="w-full my-6 sm:my-8 md:my-10">
      <div className="container mx-auto px-4 md:px-6">
        <div
          onClick={onBannerClick}
          className="rounded-2xl md:rounded-3xl overflow-hidden relative w-full promo-banner-fluid shadow-xl cursor-pointer group transition-transform duration-300 hover:scale-[1.01]"
        >
          {/* Background Image */}
          <img
            loading="lazy"
            decoding="async"
            src={banner.desktopImg}
            alt={banner.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80';
            }}
            className="w-full h-full object-cover object-center filter brightness-[0.65] transition-transform duration-700 group-hover:scale-105 absolute inset-0"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-black/40 to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 flex flex-col justify-center px-5 sm:px-10 md:px-14 py-6 sm:py-8 text-white">
            <span className="inline-block bg-blue-600 text-white text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-2 shadow-sm">
              {banner.tag}
            </span>

            <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold productSansBold drop-shadow-md">
              {banner.title}
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-gray-200 mt-1 max-w-lg font-medium drop-shadow">
              {banner.subtitle}
            </p>

            <div className="mt-3 md:mt-4 flex items-center gap-3">
              <button
                type="button"
                className="bg-primary hover:bg-[#d0181e] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-full shadow-lg transition-transform group-hover:scale-105 cursor-pointer"
              >
                Join an Upcoming Trip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
