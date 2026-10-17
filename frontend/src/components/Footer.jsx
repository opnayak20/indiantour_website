import React, { useState } from 'react';

export default function Footer({ onNavigateTab, onOpenEmiModal, onOpenAdmin }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        
        {/* Main Footer Layout: 3 Horizontal Columns matching Avian Experiences exactly */}
        <div className="site-footer-grid">
          
          {/* Column 1: Company Logo & Address */}
          <div className="site-footer-col-brand">
            <a href="/" className="inline-block bg-white px-3.5 py-2 rounded-2xl shadow-sm transition-transform hover:scale-105 mb-4">
              <img
                src="/indiatournewlogo.jpg"
                alt="India Tourism Live Travels"
                className="h-9 sm:h-11 md:h-12 w-auto object-contain"
              />
            </a>

            {/* Office Address (Clean, modern redesign with ProductSans) */}
            <a
              href="https://maps.app.goo.gl/rLe19A7kZH4jWVYw8"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-address-card group"
            >
              <div className="site-footer-address-icon">
                <svg
                  className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
              </div>
              <div className="site-footer-address-content">
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="site-footer-company-name">India Tour Pvt. Ltd.</p>
                  <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                <p className="site-footer-address-lines">
                  508, 3rd Eye Vision,<br />
                  IIM Road, Ahmedabad<br />
                  Gujarat 380015
                </p>
              </div>
            </a>
          </div>

          {/* Column 2: Explore Links (Side by Side 2-Column layout) */}
          <div className="site-footer-col-explore">
            <h3 className="site-footer-heading">
              Explore
            </h3>
            <div className="site-footer-links-grid">
              <div className="site-footer-links-col">
                <button
                  type="button"
                  onClick={() => onNavigateTab ? onNavigateTab('packages') : null}
                  className="site-footer-link"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab ? onNavigateTab('packages') : null}
                  className="site-footer-link"
                >
                  Tour Packages
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab ? onNavigateTab('group') : null}
                  className="site-footer-link"
                >
                  Group Trips
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="site-footer-link"
                >
                  <span>Sale of the Season</span>
                  <span>🎁</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab ? onNavigateTab('creator') : null}
                  className="site-footer-link"
                >
                  Creator
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('watch-read-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="site-footer-link"
                >
                  Blogs
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('contact-cta')?.scrollIntoView({ behavior: 'smooth' })}
                  className="site-footer-link"
                >
                  Careers
                </button>
              </div>

              <div className="site-footer-links-col">
                <button
                  type="button"
                  onClick={() => onOpenEmiModal ? onOpenEmiModal() : null}
                  className="site-footer-link"
                >
                  No Cost EMI
                </button>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="site-footer-link"
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('contact-cta')?.scrollIntoView({ behavior: 'smooth' })}
                  className="site-footer-link"
                >
                  Contact Us
                </button>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="site-footer-link"
                >
                  Terms &amp; Conditions
                </button>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="site-footer-link"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="site-footer-link"
                >
                  Payment Details
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Newsletter Form */}
          <div className="site-footer-col-newsletter">
            <h3 className="site-footer-heading">
              Get Updates &amp; more!
            </h3>
            <p className="site-footer-newsletter-text">
              Subscribe to the free newsletter and stay up to date.
            </p>

            {subscribed ? (
              <div style={{ backgroundColor: '#065f46', border: '1px solid #10b981', color: '#ffffff', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                ✓ Thank you for subscribing! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ width: '100%' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="site-footer-input"
                />
                <button
                  type="submit"
                  className="site-footer-submit"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Divider with Centered Copyright & Right "Made with in India" */}
        <hr className="site-footer-divider" />
        
        <div className="site-footer-bottom">
          <div className="site-footer-copyright">
            © 2026 India Tour Private Limited
          </div>
          <div className="site-footer-madein">
            <span>Made with</span>
            <span style={{ color: '#ef4444' }}>❤️</span>
            <span>in India 🇮🇳</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
