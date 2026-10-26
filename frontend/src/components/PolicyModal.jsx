import React, { useEffect } from 'react';
import { useCmsData } from '../data/cmsData';
import { FaShieldHalved, FaHandshake, FaCompass, FaWhatsapp, FaXmark } from 'react-icons/fa6';

export default function PolicyModal({ isOpen, type, onClose, onOpenEmiModal }) {
  const pagesCms = useCmsData('pages');
  const footerCms = useCmsData('footer');
  const whatsappNumber = (footerCms?.contactCta?.whatsapp || '+919548436762').replace(/[^0-9]/g, '');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !type) return null;

  const about = pagesCms?.aboutUs || {};
  const terms = pagesCms?.termsAndConditions || {};
  const privacy = pagesCms?.privacyPolicy || {};
  const cancellation = pagesCms?.cancellationPolicy || {};

  let title = '';
  let subtitle = '';
  let badge = '';
  let content = '';
  let image = null;

  if (type === 'about') {
    title = about.title || 'About India Tourism Live Travels';
    subtitle = about.subtitle || 'Crafting unforgettable adventures across India & beyond';
    badge = about.badge || 'Our Story & Purpose';
    image = about.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85';
  } else if (type === 'terms') {
    title = terms.title || 'Terms & Conditions';
    subtitle = terms.lastUpdated ? `Last updated: ${terms.lastUpdated}` : 'Standard Booking Guidelines';
    badge = 'Legal Agreement';
    content = terms.content || '';
  } else if (type === 'privacy') {
    title = privacy.title || 'Privacy Policy';
    subtitle = privacy.lastUpdated ? `Last updated: ${privacy.lastUpdated}` : 'Data Protection & Security';
    badge = 'Your Privacy Matters';
    content = privacy.content || '';
  } else if (type === 'cancellation') {
    title = cancellation.title || 'Cancellation & Refund Policy';
    subtitle = cancellation.lastUpdated ? `Last updated: ${cancellation.lastUpdated}` : 'Transparent Milestone Terms';
    badge = 'Booking Flexibility';
    content = cancellation.content || '';
  }

  // Format multi-line content into structured clauses/paragraphs
  const contentParagraphs = content ? content.split('\n').filter((p) => p.trim() !== '') : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 mb-1">
              {badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight productSansBold">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer flex-shrink-0"
            title="Close dialog"
          >
            <FaXmark size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-gray-700 text-sm leading-relaxed flex-1">
          {type === 'about' ? (
            <div className="space-y-4">
              {image && (
                <div className="rounded-2xl overflow-hidden shadow-sm h-48 sm:h-56 w-full">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-gray-900 productSansBold mb-1.5">
                  Our Journey
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {about.story || "India Tourism Live Travels curates end-to-end expeditions across snowbound mountains, exotic beaches, and off-grid valleys with verified ground captains and transparent pricing."}
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 productSansBold mb-1.5">
                  Our Mission
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {about.mission || "We believe travel should be more than sightseeing. It should create lifelong bonds, support local mountain communities, and offer stress-free journeys backed by 24x7 safety protocols."}
                </p>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
                    <FaShieldHalved size={16} />
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 mb-0.5">Safety First</h4>
                  <p className="text-[11px] text-gray-500">Certified first-aid leads & emergency oxygen</p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    <FaCompass size={16} />
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 mb-0.5">Curated Routes</h4>
                  <p className="text-[11px] text-gray-500">Local village secrets and boutique stays</p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                    <FaHandshake size={16} />
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 mb-0.5">Zero Hidden Cost</h4>
                  <p className="text-[11px] text-gray-500">100% transparent pricing with flexible EMI</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {contentParagraphs.length > 0 ? (
                contentParagraphs.map((para, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100/80 hover:bg-gray-50 transition"
                  >
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                      {para}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-6">
                  No policy clauses configured yet. Admin can update this anytime via Admin Console.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I have a question regarding ${title}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
          >
            <FaWhatsapp size={15} />
            <span>Ask Us on WhatsApp</span>
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {type === 'cancellation' && onOpenEmiModal && (
              <button
                type="button"
                onClick={onOpenEmiModal}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-red-600 border border-red-200 text-xs font-bold transition"
              >
                No Cost EMI Options ↗
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
