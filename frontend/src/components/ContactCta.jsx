import React from 'react';
import { useCmsData } from '../data/cmsData';
import {
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn
} from 'react-icons/fa6';

export default function ContactCta() {
  const footerCms = useCmsData('footer');
  const contact = footerCms?.contactCta;
  const social = footerCms?.socialLinks;

  const rawPhone = contact?.whatsapp || '+919548436762';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(contact?.whatsappMessage || 'Hello, I want details about upcoming travel experiences.');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

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
                {contact?.heading || "Don't wait any longer, Contact us!"}
              </p>
              <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold productSansBold text-gray-900 group-hover:text-primary transition-colors tracking-tight">
                {contact?.phone || "95 48 436 762"}
              </h3>
            </div>
          </a>
        </div>

        {/* Center Vertical Divider (Desktop Only) */}
        <div className="contact-cta-divider" />

        {/* Right Column: Social Media Links */}
        <div className="contact-cta-right">
          <p className="text-sm text-gray-800 font-semibold mb-3">
            {contact?.subheading || "Be part of our Social Media Journey!"}
          </p>
          
          <div className="social-badge-list">
            {/* Instagram */}
            <a
              href={social?.instagram || 'https://www.instagram.com/'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-badge social-badge-instagram"
            >
              <FaInstagram className="w-5 h-5 text-white" />
            </a>

            {/* YouTube */}
            <a
              href={social?.youtube || 'https://www.youtube.com/'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="social-badge social-badge-youtube"
            >
              <FaYoutube className="w-5 h-5 text-white" />
            </a>

            {/* Facebook */}
            <a
              href={social?.facebook || 'https://www.facebook.com/'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="social-badge social-badge-facebook"
            >
              <FaFacebookF className="w-4 h-4 text-white" />
            </a>

            {/* X (formerly Twitter) */}
            <a
              href={social?.twitter || 'https://www.x.com/'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              className="social-badge social-badge-x"
            >
              <FaXTwitter className="w-4 h-4 text-white" />
            </a>

            {/* LinkedIn */}
            <a
              href={social?.linkedin || 'https://www.linkedin.com/'}
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

