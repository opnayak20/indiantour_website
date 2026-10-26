import React from 'react';
import { useCmsData } from '../data/cmsData';

export default function PromoBannerSale({ onBannerClick }) {
  const homepageCms = useCmsData('homepage');
  const banner = homepageCms?.saleBanner || {};

  const badgeText = banner.badge || 'Limited Period Offer';
  const titleText = banner.title || 'Plan Your Winter Getaway';
  const subtitleText = banner.subtitle || 'Flat ₹4,000 Off on Early Bird Group Bookings with 0% Interest No Cost EMI';
  const codeText = banner.code || 'CODE: WINTER2026';
  const buttonText = banner.buttonText || 'Explore Deals ↗';
  const imageUrl = banner.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=85';

  return (
    <div className="w-full my-6 sm:my-8 md:my-10">
      <div className="container mx-auto px-4 md:px-6">
        <div
          onClick={onBannerClick}
          className="rounded-3xl overflow-hidden relative w-full h-[220px] sm:h-[280px] md:h-[320px] shadow-xl cursor-pointer group transition-all duration-300 hover:shadow-2xl"
        >
          {/* Background Snowy Mountain & Cable Car Image */}
          <img
            loading="lazy"
            decoding="async"
            src={imageUrl}
            alt={titleText}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80';
            }}
            className="w-full h-full object-cover object-center filter brightness-[0.78] transition-transform duration-700 group-hover:scale-105 absolute inset-0"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-slate-900/50 to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-12 md:px-16 text-white max-w-2xl">
            <span className="inline-block bg-[#e52b2b] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-2 shadow-sm">
              {badgeText}
            </span>

            <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold productSansBold drop-shadow-md leading-tight">
              {titleText}
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-gray-200 mt-2 max-w-lg font-medium drop-shadow">
              {subtitleText}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {codeText && (
                <span className="bg-white/20 backdrop-blur-md border border-white/40 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider font-mono">
                  {codeText}
                </span>
              )}
              <span className="inline-flex items-center text-xs sm:text-sm font-bold text-white group-hover:underline bg-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md">
                {buttonText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
