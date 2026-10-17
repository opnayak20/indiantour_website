import React from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa6';

export default function FloatingActions() {
  const whatsappUrl = "https://wa.me/919099599331?text=Hello,%20I%20want%20details%20about%20upcoming%20trips.";

  return (
    <div className="floating-actions-container">
      {/* Quick Phone Call Button (desktop/tablet) */}
      <a
        href="tel:+919099599331"
        aria-label="Call India Tour"
        className="hidden sm:flex w-11 h-11 sm:w-12 sm:h-12 bg-white text-gray-800 rounded-full shadow-lg border border-gray-200 items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
      >
        <FaPhone className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
      </a>

      {/* Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-11 h-11 sm:w-13 sm:h-13 bg-whatsapp text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        style={{ backgroundColor: '#25d366' }}
      >
        <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
      </a>
    </div>
  );
}

