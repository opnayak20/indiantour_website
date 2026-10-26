import React from 'react';
import { promoBanners } from '../data/websiteData';

export default function PromoBannerGroup({ onBannerClick }) {
  const banner = promoBanners.groupTrips;

  return (
    <div className="w-full my-6 sm:my-8 md:my-10">
      <div className="container mx-auto px-4 md:px-6">
        <div
          onClick={onBannerClick}
          className="rounded-2xl md:rounded-3xl overflow-hidden relative w-full shadow-xl cursor-pointer group transition-all duration-300 hover:shadow-2xl"
        >
          {/* Clean High-Resolution Avian Banner Graphic (without muddy filters or clashing text overlay) */}
          <picture>
            <source media="(max-width: 640px)" srcSet={banner.mobileImg} />
            <img
              loading="lazy"
              decoding="async"
              src={banner.desktopImg}
              alt="Community Departures - Group Trips for 18-35 Year Olds"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80';
              }}
              className="w-full h-auto object-contain block transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}

