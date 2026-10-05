import React, { useState } from 'react';

export default function Footer({ onLinkClick }) {
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
    <footer style={{ backgroundColor: '#3e3e3e' }} className="pt-24 pb-8 text-white relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Main Footer Layout */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 pb-12">
          
          {/* Column 1: Company Logo & Address */}
          <div className="w-full lg:w-1/3 flex flex-col items-start space-y-4">
            <a href="/" className="flex items-center gap-2 group">
              <svg className="w-9 h-9 text-primary flex-shrink-0" viewBox="0 0 40 40" fill="currentColor">
                <path d="M4 24C9 14 19 6 36 4C31 14 26 22 18 28C13 32 8 33 4 33C3 33 2 32 2 31C2 29 3 26 4 24Z" fill="#EC1D24" />
                <path d="M12 28C17 22 24 16 34 11C28 19 23 27 16 34C13 37 10 37 8 36C7 35 7 34 8 33C9 31 10 29 12 28Z" fill="#FFFFFF" opacity="0.9" />
              </svg>
              <div className="flex flex-col -space-y-1.5 leading-none">
                <span className="font-extrabold text-xl text-white uppercase tracking-wider font-sans">
                  INDIA
                </span>
                <span className="text-sm font-bold text-primary lowercase tracking-normal pl-0.5" style={{ fontFamily: "'Caveat', cursive" }}>
                  tour
                </span>
              </div>
            </a>

            {/* Office Address */}
            <a
              href="https://maps.app.goo.gl/rLe19A7kZH4jWVYw8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 text-gray-300 hover:text-white transition-colors group mt-2"
            >
              <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <div className="text-xs md:text-sm leading-relaxed">
                <p className="font-bold text-white">India Tour Pvt. Ltd.</p>
                <p>508, 3rd Eye Vision,</p>
                <p>IIM Road, Ahmedabad,</p>
                <p>Gujarat 380015</p>
              </div>
            </a>
          </div>

          {/* Column 2: Explore Links */}
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <h3 className="text-xl md:text-2xl productSansBold font-bold mb-4 text-white">
              Explore
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-xs md:text-sm text-gray-300">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <a href="#packages" className="hover:text-primary transition-colors">Tour Packages</a>
              <a href="#group" className="hover:text-primary transition-colors">Group Trips</a>
              <a href="#sale" className="hover:text-primary transition-colors">Sale of the Season 🎁</a>
              <a href="#creator" className="hover:text-primary transition-colors">Creator Trips</a>
              <a href="#blogs" className="hover:text-primary transition-colors">Blogs &amp; Stories</a>
              <a href="#careers" className="hover:text-primary transition-colors">Careers</a>
              <a href="#emi" className="hover:text-primary transition-colors">No Cost EMI</a>
              <a href="#about" className="hover:text-primary transition-colors">About Us</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact Us</a>
              <a href="#terms" className="hover:text-primary transition-colors">Terms &amp; Conditions</a>
              <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            </div>
          </div>

          {/* Column 3: Newsletter Form */}
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <h3 className="text-xl md:text-2xl productSansBold font-bold mb-2 text-white">
              Get Updates &amp; more!
            </h3>
            <p className="text-xs md:text-sm text-gray-300 mb-4 leading-relaxed">
              Subscribe to the free newsletter and stay up to date on seasonal offers, new routes &amp; treks.
            </p>

            {subscribed ? (
              <div className="bg-green-800/80 border border-green-500 text-green-100 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium">
                ✓ Thank you for subscribing! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full py-2.5 px-4 bg-[#2f2f2f] text-white placeholder-gray-400 border border-gray-600 rounded-xl text-center focus:outline-none focus:border-primary text-sm transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors cursor-pointer shadow-md"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Divider with Copyright */}
        <div className="flex items-center justify-center my-6">
          <div className="w-full border-t border-gray-600" />
          <div className="px-4 whitespace-nowrap text-xs md:text-sm text-gray-400">
            © 2026 India Tour Private Limited
          </div>
          <div className="w-full border-t border-gray-600" />
        </div>

        {/* Made with love in India */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm text-gray-400 gap-2 pt-2">
          <span>Official Travel &amp; Tour Experiential Platform</span>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <span className="text-primary text-base font-bold">♥</span>
            <span>in India</span>
            <span className="text-base" role="img" aria-label="India Flag">🇮🇳</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
