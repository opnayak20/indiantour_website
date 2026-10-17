import React from 'react';
import {
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn
} from 'react-icons/fa6';

export default function ContactCta() {
  const whatsappUrl = "https://wa.me/919099599331?text=Hello,%20I%20want%20details%20about%20upcoming%20experiences.";

  return (
    <div className="contact-cta-wrapper">
      <div className="contact-cta-card">
        
        {/* Left Column: Direct WhatsApp & Call */}
        <div className="contact-cta-left">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group cursor-pointer text-decoration-none"
          >
            {/* WhatsApp Icon */}
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <FaWhatsapp className="w-12 h-12 md:w-14 md:h-14 whatsapp-green" style={{ color: '#25d366' }} />
            </div>

            <div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                Don't wait any longer, Contact us!
              </p>
              <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold productSansBold text-gray-900 group-hover:text-primary transition-colors tracking-tight">
                90 99 599 331
              </h3>
            </div>
          </a>
        </div>

        {/* Center Vertical Divider (Desktop Only) */}
        <div className="contact-cta-divider" />

        {/* Right Column: Social Media Links */}
        <div className="contact-cta-right">
          <p className="text-sm text-gray-800 font-semibold mb-3">
            Be part of our Social Media Journey!
          </p>
          
          <div className="social-badge-list">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-badge social-badge-instagram"
            >
              <FaInstagram className="w-5 h-5 text-white" />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="social-badge social-badge-youtube"
            >
              <FaYoutube className="w-5 h-5 text-white" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="social-badge social-badge-facebook"
            >
              <FaFacebookF className="w-4 h-4 text-white" />
            </a>

            {/* X (formerly Twitter) */}
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              className="social-badge social-badge-x"
            >
              <FaXTwitter className="w-4 h-4 text-white" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="social-badge social-badge-linkedin"
            >
              <FaLinkedinIn className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

