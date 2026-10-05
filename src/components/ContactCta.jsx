import React from 'react';

export default function ContactCta() {
  const whatsappUrl = "https://wa.me/919099599331?text=Hello,%20I%20want%20details%20about%20upcoming%20experiences.";

  return (
    <div className="mx-4 md:mx-auto max-w-5xl -mb-16 md:-mb-10 md:mt-20 mt-28 relative z-20">
      <div className="bg-white py-7 px-6 md:px-12 rounded-3xl shadow-2xl border border-gray-100">
        <div className="flex flex-col md:flex-row justify-around items-center gap-6 md:gap-8">
          
          {/* Left Column: Direct WhatsApp & Call */}
          <div className="md:border-r border-gray-200 md:pr-10 w-full md:w-1/2 flex justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group cursor-pointer"
            >
              {/* WhatsApp Icon */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M12.011 2c-5.506 0-9.988 4.478-9.99 9.984a9.96 9.96 0 001.334 4.992L2 22l5.232-1.236a9.98 9.98 0 004.774 1.215h.004c5.505 0 9.985-4.479 9.988-9.984a9.96 9.96 0 00-2.922-7.067A9.95 9.95 0 0012.011 2zm0 18.02a8.3 8.3 0 01-4.234-1.157l-.304-.18-3.147.744.757-3.067-.198-.315a8.27 8.27 0 01-1.267-4.425c.002-4.582 3.73-8.31 8.313-8.31a8.25 8.25 0 015.88 2.437 8.25 8.25 0 012.436 5.88c-.002 4.583-3.73 8.312-8.314 8.312z" />
                  <path d="M16.566 14.076c-.25-.125-1.477-.728-1.706-.811-.229-.083-.396-.125-.562.125-.166.25-.643.811-.789.977-.146.166-.291.189-.541.064-.25-.125-1.054-.389-2.008-1.239-.742-.661-1.243-1.477-1.389-1.727-.145-.25-.014-.386.111-.51.112-.112.25-.292.375-.438.124-.146.167-.25.25-.416.083-.166.041-.313-.021-.438s-.562-1.353-.784-1.847c-.222-.494-.42-.424-.598-.431h-.51c-.167 0-.437.063-.666.313-.229.25-.875.854-.875 2.082s.895 2.416 1.02 2.583c.125.166 1.728 2.766 4.265 3.766 2.108.831 2.536.668 2.994.627.458-.042 1.478-.604 1.686-1.187.208-.583.208-1.084.146-1.187-.062-.104-.229-.166-.479-.291z" />
                </svg>
              </div>

              <div>
                <p className="whitespace-nowrap text-xs md:text-sm text-gray-500 font-medium">
                  Don't wait any longer, Contact us!
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold productSansBold text-gray-900 group-hover:text-primary transition-colors">
                  90 99 599 331
                </h3>
              </div>
            </a>
          </div>

          {/* Right Column: Social Media Links */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start md:pl-6">
            <p className="text-xs md:text-sm text-gray-600 font-semibold mb-2.5">
              Be part of our Social Media Journey!
            </p>
            
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/avianexperiences/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-700 flex items-center justify-center text-white shadow hover:scale-110 transition-transform"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@avianxp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white shadow hover:scale-110 transition-transform"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/avianexperiences"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow hover:scale-110 transition-transform"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com/AvianXP"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow hover:scale-110 transition-transform"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/avianexperiences"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white shadow hover:scale-110 transition-transform"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
