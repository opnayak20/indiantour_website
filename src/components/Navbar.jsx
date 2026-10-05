import React from 'react';

export default function Navbar({ onOpenAuthModal, activeTab, setActiveTab }) {
  return (
    <div className="bg-white w-full lg:shadow-md border-b border-gray-100 lg:border-none sticky top-0 z-40">
      <div className="flex container mx-auto sm:px-0 px-4 py-2 items-center justify-between">
        
        {/* Brand Logo: India Tour matching the reference styling */}
        <a className="flex items-center gap-2 cursor-pointer group" href="/">
          <svg className="w-8 h-8 md:w-9 md:h-9 text-primary flex-shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 40 40" fill="currentColor">
            <path d="M4 24C9 14 19 6 36 4C31 14 26 22 18 28C13 32 8 33 4 33C3 33 2 32 2 31C2 29 3 26 4 24Z" fill="#EC1D24" />
            <path d="M12 28C17 22 24 16 34 11C28 19 23 27 16 34C13 37 10 37 8 36C7 35 7 34 8 33C9 31 10 29 12 28Z" fill="#B3141A" opacity="0.85" />
            <circle cx="28" cy="11" r="2" fill="#FFFFFF" />
          </svg>
          <div className="flex flex-col -space-y-1.5 leading-none">
            <span className="font-extrabold text-xl md:text-2xl tracking-wider text-gray-950 uppercase font-sans">
              INDIA
            </span>
            <span className="text-sm md:text-base font-bold text-gray-600 lowercase tracking-normal pl-0.5" style={{ fontFamily: "'Caveat', cursive" }}>
              tour
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation Links */}
        <div className="lg:block hidden whitespace-nowrap py-3 rounded-full">
          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`text-base px-8 py-3.5 rounded-full transition-colors cursor-pointer ${
              activeTab === 'packages'
                ? 'font-bold text-gray-900 bg-[#e8e8e8]'
                : 'text-gray-800 hover:bg-[#dddddd]'
            }`}
          >
            Tour Packages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('group')}
            className={`text-base px-8 py-3.5 rounded-full transition-colors cursor-pointer ${
              activeTab === 'group'
                ? 'font-bold text-gray-900 bg-[#e8e8e8]'
                : 'text-gray-800 hover:bg-[#dddddd]'
            }`}
          >
            Group Trips
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('creator')}
            className={`text-base px-8 py-3.5 rounded-full transition-colors cursor-pointer ${
              activeTab === 'creator'
                ? 'font-bold text-gray-900 bg-[#e8e8e8]'
                : 'text-gray-800 hover:bg-[#dddddd]'
            }`}
          >
            Creator Trips
          </button>
        </div>

        {/* Right User Account Button */}
        <div>
          <button
            type="button"
            onClick={onOpenAuthModal}
            aria-label="User Account"
            className="bg-transparent border-0 cursor-pointer text-gray-700 hover:text-primary transition-colors flex items-center"
          >
            <span
              role="img"
              aria-label="user"
              className="anticon anticon-user ms-2 border border-gray-400 p-1.5 rounded-full flex items-center justify-center hover:border-primary transition-colors"
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="user"
                width="1.35em"
                height="1.35em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
              </svg>
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
