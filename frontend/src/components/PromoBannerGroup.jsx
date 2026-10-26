import React from 'react';
import { useCmsData } from '../data/cmsData';
import { promoBanners } from '../data/websiteData';

export default function PromoBannerGroup({ onBannerClick }) {
  const homepageCms = useCmsData('homepage');
  const bannerConfig = homepageCms?.groupBanner || {};

  const desktopImg = bannerConfig.desktopImg || promoBanners.groupTrips?.desktopImg || 'https://img.indiatour.live/banner/desktop/community_trips.webp';
  const mobileImg = bannerConfig.mobileImg || promoBanners.groupTrips?.mobileImg || 'https://img.indiatour.live/banner/mobile/community_trips.webp';
  const altText = bannerConfig.title || 'Community Departures - Group Trips for 18-35 Year Olds';

  return (
    <div className="w-full my-6 sm:my-8 md:my-10">
      <div className="container mx-auto px-4 md:px-6">
        <div
          onClick={onBannerClick}
          className="rounded-2xl md:rounded-3xl overflow-hidden relative w-full shadow-xl cursor-pointer group transition-all duration-300 hover:shadow-2xl"
        >
          {/* High-Resolution Community Departure Banner Graphic */}
          <picture>
            <source media="(max-width: 640px)" srcSet={mobileImg} />
            <img
              loading="lazy"
              decoding="async"
              src={desktopImg}
              alt={altText}
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
