import React, { useState } from 'react';
import { groupFilterCategories, groupTripsList } from '../data/groupTripsData';
import LazyImage from './LazyImage';

function GroupTripCard({ trip, onSelectTrip }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? trip.images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === trip.images.length - 1 ? 0 : prev + 1));
  };

  const saveText = trip.saveAmount || (trip.badge ? trip.badge.replace(/SAVE\s*₹?/i, '').trim() : '3,000');

  return (
    <div
      onClick={() => onSelectTrip(trip)}
      className="avian-main-card"
    >
      {/* 1. Top Floating Image Card with heavy drop shadow (300px width, 15/11 aspect-ratio, 1.5rem rounded) */}
      <div className="avian-img-card">
        <div className="rounded-3xl w-full h-full overflow-hidden relative">
          <LazyImage
            src={trip.images[activeImgIndex] || trip.images[0]}
            alt={`${trip.title} - Photo ${activeImgIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* Previous Image Arrow on Hover */}
          {trip.images && trip.images.length > 1 && (
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous photo"
              className="avian-nav-btn absolute left-2.5 top-1/2 -translate-y-1/2 items-center justify-center shadow-md cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Image Arrow on Hover */}
          {trip.images && trip.images.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next photo"
              className="avian-nav-btn absolute right-2.5 top-1/2 -translate-y-1/2 items-center justify-center shadow-md cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* 5 Carousel Dots Indicator matching reference screenshot */}
          <div className="avian-dot-container">
            {[0, 1, 2, 3, 4].map((dotIdx) => {
              const isActive = (activeImgIndex % 5) === dotIdx;
              return (
                <span
                  key={dotIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (trip.images && trip.images.length > 0) {
                      setActiveImgIndex(dotIdx % trip.images.length);
                    }
                  }}
                  className={`avian-dot ${isActive ? 'is-active' : ''}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Recessed Card Body underneath (280px width, margin-top: -0.5rem, rounded-b-3xl) */}
      <div className="flex justify-center relative">
        <div className="avian-body-card">
          <div className="px-5 pt-5 pb-4 flex flex-col justify-between" style={{ minHeight: '195px' }}>
            <div>
              <p className="avian-duration">
                {trip.duration}
              </p>
              <h3 className="avian-title line-clamp-2">
                {trip.title}
              </h3>
              <h6 className="avian-subtitle line-clamp-1">
                {trip.route}
              </h6>
            </div>

            {/* Divider Line */}
            <div className="avian-divider">
              {/* Save Badge matching screenshot: green border, rounded-md, green checkmark */}
              <div className="flex justify-between pb-1.5">
                <div className="mb-0.5">
                  <div className="avian-save-badge">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Save {saveText}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Row: Red discounted price + muted strikethrough price */}
              <div className="avian-price-row">
                <h3 className="avian-price">
                  ₹ {trip.price?.toLocaleString('en-IN')}
                </h3>
                {trip.originalPrice && (
                  <h3 className="avian-original-price">
                    ₹ {trip.originalPrice?.toLocaleString('en-IN')}
                  </h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GroupTripsPage({ onTripSelect, isCreator = false }) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const winterTrips = groupTripsList.filter((trip) => trip.seasonType === 'winter');
  const summerTrips = groupTripsList.filter((trip) => trip.seasonType === 'summer');

  const filteredTrips = selectedFilter === 'all'
    ? groupTripsList
    : groupTripsList.filter((trip) => trip.category === selectedFilter);

  return (
    <div className="bg-white min-h-[80vh] pb-16 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Creator Expeditions Header Banner if Creator tab */}
        {isCreator && (
          <div className="my-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-[#ec1d24] text-white shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">
              Exclusive Expeditions
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold productSansBold mb-2">
              Creator-Led Group Expeditions
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
              Travel alongside celebrated photographers, content creators, and expert mountain leaders. Hand-crafted routes, small groups, and unforgettable moments.
            </p>
          </div>
        )}

        {/* Horizontal Category Filter Pills (Exact match to screenshot: All (red border), Jaisalmer, Meghalaya...) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-6 sm:py-8 px-2 flex-wrap">
          {groupFilterCategories.map((cat) => {
            const isActive = selectedFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedFilter(cat.id)}
                className={`avian-filter-pill ${isActive ? 'is-active' : ''}`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Content view: When 'all' is selected, show separated Winter & Summer sections */}
        {selectedFilter === 'all' ? (
          <div className="space-y-10 sm:space-y-14">
            
            {/* 1. Winter Group Trips Section with ─── WINTER GROUP TRIPS ─── Divider */}
            <div>
              <div className="avian-section-header">
                <span className="avian-header-line-left"></span>
                <h2 className="avian-header-title">
                  WINTER GROUP TRIPS
                </h2>
                <span className="avian-header-line-right"></span>
              </div>

              {/* Flex Container with 300px Avian cards centered */}
              <div className="pt-2 pb-6 md:pt-3 flex flex-wrap justify-center">
                {winterTrips.map((trip) => (
                  <GroupTripCard
                    key={trip.id}
                    trip={trip}
                    onSelectTrip={onTripSelect}
                  />
                ))}
              </div>
            </div>

            {/* 2. Summer Group Trips Section with ─── SUMMER GROUP TRIPS ─── Divider */}
            <div>
              <div className="avian-section-header">
                <span className="avian-header-line-left"></span>
                <h2 className="avian-header-title">
                  SUMMER GROUP TRIPS
                </h2>
                <span className="avian-header-line-right"></span>
              </div>

              {/* Flex Container with 300px Avian cards centered */}
              <div className="pt-2 pb-6 md:pt-3 flex flex-wrap justify-center">
                {summerTrips.map((trip) => (
                  <GroupTripCard
                    key={trip.id}
                    trip={trip}
                    onSelectTrip={onTripSelect}
                  />
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Filtered Destination View */
          <div>
            <div className="avian-section-header">
              <span className="avian-header-line-left"></span>
              <h2 className="avian-header-title">
                {groupFilterCategories.find((c) => c.id === selectedFilter)?.name || 'EXPERIENCES'} GROUP TRIPS
              </h2>
              <span className="avian-header-line-right"></span>
            </div>

            {/* Flex Container with 300px Avian cards centered */}
            <div className="pt-2 pb-6 md:pt-3 flex flex-wrap justify-center">
              {filteredTrips.map((trip) => (
                <GroupTripCard
                  key={trip.id}
                  trip={trip}
                  onSelectTrip={onTripSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state fallback */}
        {filteredTrips.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 my-8">
            <p className="text-gray-500 text-sm font-medium">No group trips found for this destination at the moment.</p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="mt-4 px-6 py-2.5 text-xs font-bold text-white bg-primary rounded-full shadow-md cursor-pointer hover:bg-[#e04f00] transition"
            >
              View All Group Trips
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
