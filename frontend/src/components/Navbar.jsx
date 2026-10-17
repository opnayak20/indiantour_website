import React, { useState, useEffect, useRef } from 'react';

export default function Navbar({ onOpenAuthModal, activeTab, setActiveTab, onOpenAdmin, currentUser, onLogout }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const handleAvatarClick = () => {
    if (currentUser) {
      setIsProfileMenuOpen((prev) => !prev);
    } else {
      onOpenAuthModal();
    }
  };

  return (
    <div className="bg-white w-full lg:shadow-md border-b border-gray-100 lg:border-none sticky top-0 z-40">
      <div className="flex container mx-auto px-4 sm:px-6 lg:px-8 py-2 items-center justify-between">
        
        {/* Brand Logo: India Tourism Live Travels */}
        <a className="flex items-center cursor-pointer group py-1 flex-shrink-0" href="/">
          <img
            src="/indiatournewlogo.jpg"
            alt="India Tourism Live Travels"
            className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </a>

        {/* Center Desktop Navigation Links */}
        <div className="lg:flex hidden items-center bg-[#eaeaea] p-1 rounded-full border border-gray-200/60 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`text-sm px-6 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'packages'
                ? 'font-bold text-gray-950 bg-white shadow-sm'
                : 'text-gray-700 hover:text-gray-950 font-medium'
            }`}
          >
            Tour Packages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('group')}
            className={`text-sm px-6 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'group'
                ? 'font-bold text-gray-950 bg-white shadow-sm'
                : 'text-gray-700 hover:text-gray-950 font-medium'
            }`}
          >
            Group Trips
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('creator')}
            className={`text-sm px-6 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'creator'
                ? 'font-bold text-gray-950 bg-white shadow-sm'
                : 'text-gray-700 hover:text-gray-950 font-medium'
            }`}
          >
            Creator Trips
          </button>
        </div>

        {/* Right User Profile Icon Button (Avian Experiences exact style) */}
        <div className="flex items-center gap-2.5 relative" ref={menuRef}>
          <a
            href="https://wa.me/919099599331?text=Hello,%20I%20am%20interested%20in%20booking%20a%20tour%20package."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#fff5f6] hover:bg-[#ffebee] text-[#ec1d24] border border-red-200/80 text-xs font-bold px-3.5 py-2 rounded-full transition shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#ec1d24] animate-pulse"></span>
            Talk to Expert
          </a>

          {/* User Profile Avatar Button */}
          <button
            type="button"
            onClick={handleAvatarClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition border shadow-2xs cursor-pointer ${
              currentUser
                ? 'bg-red-50 border-red-200 text-[#e52b2b]'
                : 'text-gray-700 hover:text-gray-950 hover:bg-gray-100 border-gray-200'
            }`}
            title={currentUser ? `Logged in as ${currentUser.name || 'User'}` : "Log In or Sign Up"}
            aria-label="User Account"
          >
            {currentUser?.name ? (
              <span className="text-xs font-black tracking-tight uppercase">
                {currentUser.name.slice(0, 2)}
              </span>
            ) : (
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </button>

          {/* User Logged-in Dropdown Menu */}
          {currentUser && isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-fadeIn">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-red-100 text-[#e52b2b] flex items-center justify-center font-bold text-sm">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {currentUser.name || 'Traveler'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser.email || currentUser.phone || 'Verified Tourist'}
                  </p>
                </div>
              </div>

              <div className="py-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-[#ec1d24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin Panel</span>
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Active Traveler Session</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
