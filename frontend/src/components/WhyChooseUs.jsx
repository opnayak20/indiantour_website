import React from 'react';
import {
  FaShieldHalved,
  FaBed,
  FaPersonHiking,
  FaCreditCard,
  FaStar,
  FaUsers,
  FaCompass,
  FaHeart
} from 'react-icons/fa6';

export default function WhyChooseUs({ onExploreClick }) {
  const features = [
    {
      icon: <FaShieldHalved className="w-6 h-6 text-[#ec1d24]" />,
      title: '100% Guaranteed Departures',
      desc: 'Once your booking is confirmed, your trip is on. We never cancel departures, ensuring your travel plans remain seamless.'
    },
    {
      icon: <FaBed className="w-6 h-6 text-[#ec1d24]" />,
      title: 'Handpicked Stays & Camps',
      desc: 'Stay in carefully audited 3-star boutique hotels, cozy alpine Swiss tents, and authentic cultural homestays.'
    },
    {
      icon: <FaPersonHiking className="w-6 h-6 text-[#ec1d24]" />,
      title: 'Certified & Friendly Trip Leaders',
      desc: 'Every expedition is guided by certified mountain leaders and first-aid experts who prioritize safety and community vibes.'
    },
    {
      icon: <FaCreditCard className="w-6 h-6 text-[#ec1d24]" />,
      title: 'Transparent Pricing & 0% EMI',
      desc: 'No hidden taxes or on-trip surprises. Flexible payment options including instant 0% Interest No-Cost EMI.'
    }
  ];

  const stats = [
    { icon: <FaUsers className="w-5 h-5 text-[#ec1d24]" />, value: '15,000+', label: 'Happy Explorers' },
    { icon: <FaStar className="w-5 h-5 text-amber-400" />, value: '4.9 / 5.0', label: 'Average Traveler Rating' },
    { icon: <FaCompass className="w-5 h-5 text-[#ec1d24]" />, value: '250+', label: 'Curated Itineraries' },
    { icon: <FaHeart className="w-5 h-5 text-rose-500" />, value: '98%', label: 'Repeat & Referral Rate' }
  ];

  return (
    <section className="py-12 md:py-16 bg-[#fafafa] border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <span 
            className="inline-block text-[11px] md:text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3 border border-red-100"
            style={{ backgroundColor: '#fff5f6', color: '#ec1d24' }}
          >
            The Experience Standard
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold productSansBold text-gray-950 tracking-tight">
            Why Travel With Us?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 font-normal">
            We don't just book trips — we curate immersive journeys, lifelong friendships, and stress-free adventures.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-12">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl md:rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: '#fff5f6' }}
                >
                  {item.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold productSansBold text-gray-900 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Strip */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-200/70 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 mb-1.5">
                {s.icon}
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold productSansBold text-gray-950">
                  {s.value}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
