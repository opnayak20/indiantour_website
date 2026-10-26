import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { useCmsData } from '../data/cmsData';

export default function EmiModal({ isOpen, onClose }) {
  const pagesCms = useCmsData('pages');
  const footerCms = useCmsData('footer');
  const emi = pagesCms?.emiModal || {};
  const whatsappNumber = footerCms?.contactCta?.whatsapp?.replace(/[^0-9]/g, '') || '919548436762';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto my-auto p-5 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-[#fff5f6] flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
            %
          </div>
          <div>
            <h3 className="text-lg sm:text-2xl font-bold productSansBold text-gray-900">
              {emi.title || 'No Cost EMI on All Trips'}
            </h3>
            <p className="text-xs text-gray-500">
              {emi.subtitle || 'Plan now, pay flexibly in easy monthly installments'}
            </p>
          </div>
        </div>

        <div className="space-y-3 my-5 text-xs sm:text-sm text-gray-700">
          <div className="flex items-start gap-2.5 sm:gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-primary text-base font-bold">✓</span>
            <div>
              <strong className="block text-gray-900 font-semibold">{emi.point1Title || 'Up to 6 Months Zero Interest'}</strong>
              {emi.point1Desc || 'No hidden charges, zero processing fees, and exact division of your package total.'}
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-primary text-base font-bold">✓</span>
            <div>
              <strong className="block text-gray-900 font-semibold">{emi.point2Title || 'No Credit Card Needed'}</strong>
              {emi.point2Desc || 'Eligible via UPI, debit card, or fast digital paperless verification in under 2 minutes.'}
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-primary text-base font-bold">✓</span>
            <div>
              <strong className="block text-gray-900 font-semibold">{emi.point3Title || 'Applicable on All Experiences'}</strong>
              {emi.point3Desc || 'Includes Spiti Valley, Leh Ladakh, Meghalaya, Vietnam, Bali, Kedarnath, and more.'}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20the%20No%20Cost%20EMI%20plan.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-primary hover:bg-[#d0181e] text-white font-bold py-3 px-4 rounded-xl text-center text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <FaWhatsapp className="w-5 h-5 flex-shrink-0" />
            <span>{emi.whatsappButtonText || 'Check EMI Eligibility via WhatsApp'}</span>
          </a>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
