import React, { useState } from 'react';

export default function TourDetailsModal({ tour, onClose }) {
  if (!tour) return null;

  const [activeImage, setActiveImage] = useState(0);

  const images = tour.images || (tour.image ? [tour.image] : []);
  const title = tour.title || tour.name;
  const price = tour.price || 19999;
  const originalPrice = tour.originalPrice || price + 4000;
  const duration = tour.duration || '6 Days 5 Nights';
  const route = tour.route || `Exotic sightseeing and adventure itinerary in ${title}`;

  const whatsappMessage = encodeURIComponent(
    `Hello India Tour! I am interested in booking the "${title}" (${duration}) starting at ₹${price.toLocaleString('en-IN')}. Please share itinerary details and upcoming dates.`
  );
  const whatsappUrl = `https://wa.me/919099599331?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-700 hover:text-black bg-white/80 hover:bg-white backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-md transition-colors"
        >
          ✕
        </button>

        {/* Big Gallery Image */}
        <div className="relative w-full h-[220px] sm:h-[270px] bg-gray-900">
          <img
            src={images[activeImage] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-primary px-2.5 py-0.5 rounded-md mb-1 inline-block">
              {duration}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold productSansBold text-white drop-shadow">
              {title}
            </h2>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar bg-gray-50 border-b border-gray-100">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-14 h-11 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                  activeImage === i ? 'border-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Body Details */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Tour Route &amp; Highlights
            </h4>
            <p className="text-sm text-gray-800 font-medium">
              {route}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 block">Stay &amp; Accommodation</span>
              <span className="text-xs font-bold text-gray-800">Camps, Villas &amp; 3-Star Hotels</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 block">Meals Included</span>
              <span className="text-xs font-bold text-gray-800">Breakfast &amp; Dinner Included</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 block">Guide &amp; Transport</span>
              <span className="text-xs font-bold text-gray-800">Experienced Expedition Lead</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 block">No Cost EMI</span>
              <span className="text-xs font-bold text-primary">From ₹{Math.round(price / 6).toLocaleString('en-IN')}/mo</span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-200">
            <div>
              <span className="text-xs text-gray-500 block">Starting from</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-primary productSansBold">
                  ₹ {price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₹ {originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span>Book via WhatsApp</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
