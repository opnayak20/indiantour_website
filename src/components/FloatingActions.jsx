import React from 'react';

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
        <svg className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>

      {/* Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-11 h-11 sm:w-13 sm:h-13 bg-[#25D366] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.011 2c-5.506 0-9.988 4.478-9.99 9.984a9.96 9.96 0 001.334 4.992L2 22l5.232-1.236a9.98 9.98 0 004.774 1.215h.004c5.505 0 9.985-4.479 9.988-9.984a9.96 9.96 0 00-2.922-7.067A9.95 9.95 0 0012.011 2zm0 18.02a8.3 8.3 0 01-4.234-1.157l-.304-.18-3.147.744.757-3.067-.198-.315a8.27 8.27 0 01-1.267-4.425c.002-4.582 3.73-8.31 8.313-8.31a8.25 8.25 0 015.88 2.437 8.25 8.25 0 012.436 5.88c-.002 4.583-3.73 8.312-8.314 8.312z" />
          <path d="M16.566 14.076c-.25-.125-1.477-.728-1.706-.811-.229-.083-.396-.125-.562.125-.166.25-.643.811-.789.977-.146.166-.291.189-.541.064-.25-.125-1.054-.389-2.008-1.239-.742-.661-1.243-1.477-1.389-1.727-.145-.25-.014-.386.111-.51.112-.112.25-.292.375-.438.124-.146.167-.25.25-.416.083-.166.041-.313-.021-.438s-.562-1.353-.784-1.847c-.222-.494-.42-.424-.598-.431h-.51c-.167 0-.437.063-.666.313-.229.25-.875.854-.875 2.082s.895 2.416 1.02 2.583c.125.166 1.728 2.766 4.265 3.766 2.108.831 2.536.668 2.994.627.458-.042 1.478-.604 1.686-1.187.208-.583.208-1.084.146-1.187-.062-.104-.229-.166-.479-.291z" />
        </svg>
      </a>
    </div>
  );
}
