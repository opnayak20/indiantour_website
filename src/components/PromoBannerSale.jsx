import React from 'react';
import { promoBanners } from '../data/websiteData';

export default function PromoBannerSale({ onBannerClick }) {
  const banner = promoBanners.sale;

  return (
    <div className="w-full my-6 sm:my-8 md:my-10">
      <div className="container mx-auto px-4 md:px-6">
        <div
          onClick={onBannerClick}
          className="rounded-2xl md:rounded-3xl overflow-hidden relative w-full h-52 sm:h-56 md:h-64 shadow-xl cursor-pointer group transition-transform duration-300 hover:scale-[1.01]"
        >
          {/* Background Image */}
          <img
            src={banner.desktopImg}
            alt={banner.title}
            className="w-full h-full object-cover object-center filter brightness-[0.70] transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/85 via-black/40 to-transparent" />

          {/* Banner Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-14 text-white">
            <span className="inline-block bg-primary text-white text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-2 shadow-sm">
              {banner.tag}
            </span>

            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold productSansBold drop-shadow-md">
              {banner.title}
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-gray-200 mt-1 max-w-lg font-medium drop-shadow">
              {banner.subtitle}
            </p>

            <div className="mt-3 md:mt-4 flex items-center gap-3">
              <span className="bg-white/20 backdrop-blur-md border border-white/40 px-3 py-1 rounded-lg text-xs md:text-sm font-semibold tracking-wider font-mono">
                CODE: {banner.code}
              </span>
              <span className="inline-flex items-center text-xs md:text-sm font-bold text-yellow-300 group-hover:underline">
                Explore Deals
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
