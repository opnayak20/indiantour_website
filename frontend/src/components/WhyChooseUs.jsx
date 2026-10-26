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
import { useCmsData } from '../data/cmsData';

export default function WhyChooseUs({ onExploreClick }) {
  const homepageCms = useCmsData('homepage');
  const whyConfig = homepageCms?.whyChooseUs;

  const features = [
    {
      icon: <FaPersonHiking className="w-6 h-6 text-[#ec1d24]" />,
      title: whyConfig?.pillar1Title || 'Certified Trip Captains',
      desc: whyConfig?.pillar1Desc || 'Experienced ground expedition leaders certified in safety and first-aid.'
    },
    {
      icon: <FaBed className="w-6 h-6 text-[#ec1d24]" />,
      title: whyConfig?.pillar2Title || 'Handpicked Premium Stays',
      desc: whyConfig?.pillar2Desc || 'Verified boutique resorts, scenic campsites, and comfortable private transfers.'
    },
    {
      icon: <FaCreditCard className="w-6 h-6 text-[#ec1d24]" />,
      title: whyConfig?.pillar3Title || '100% Transparent Pricing',
      desc: whyConfig?.pillar3Desc || 'No hidden taxes or last-minute surprises. Flexible No Cost EMI available.'
    },
    {
      icon: <FaUsers className="w-6 h-6 text-[#ec1d24]" />,
      title: whyConfig?.pillar4Title || '50,000+ Happy Explorers',
      desc: whyConfig?.pillar4Desc || 'Consistently rated 4.9/5 by solo travelers, couples, and adventure lovers.'
    }
  ];

  const stats = [
    { icon: <FaUsers className="w-5 h-5 text-[#ec1d24]" />, value: whyConfig?.stat1Value || '15,000+', label: whyConfig?.stat1Label || 'Happy Explorers' },
    { icon: <FaStar className="w-5 h-5 text-amber-400" />, value: whyConfig?.stat2Value || '4.9 / 5.0', label: whyConfig?.stat2Label || 'Average Traveler Rating' },
    { icon: <FaCompass className="w-5 h-5 text-[#ec1d24]" />, value: whyConfig?.stat3Value || '250+', label: whyConfig?.stat3Label || 'Curated Itineraries' },
    { icon: <FaHeart className="w-5 h-5 text-rose-500" />, value: whyConfig?.stat4Value || '98%', label: whyConfig?.stat4Label || 'Repeat & Referral Rate' }
  ];

  return (
    <section className="py-12 md:py-16 bg-[#fdf8f3] border-y border-[#f0e8de]">
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
            {whyConfig?.heading || 'Why Travel With Us?'}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 font-normal">
            {whyConfig?.subtitle || "We don't just book trips — we curate immersive journeys, lifelong friendships, and stress-free adventures."}
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
