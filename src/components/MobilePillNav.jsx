import React from 'react';

export default function MobilePillNav({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white pt-2.5 pb-2.5 md:hidden border-b border-gray-100">
      <div className="flex justify-center items-center shadow-md mx-auto w-[355px] max-w-[92vw] border border-[#dddddd] py-1 px-1 rounded-full bg-white">
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex-1 text-xs sm:text-sm py-2 px-2.5 rounded-full font-medium transition-all duration-200 text-center cursor-pointer ${
            activeTab === 'packages'
              ? 'font-bold text-gray-950 bg-gray-100'
              : 'text-gray-800 hover:text-primary'
          }`}
        >
          Tour Packages
        </button>
        <button
          onClick={() => setActiveTab('group')}
          className={`flex-1 text-xs sm:text-sm py-2 px-2.5 half-border-left-right font-medium transition-all duration-200 text-center cursor-pointer ${
            activeTab === 'group'
              ? 'font-bold text-gray-950 bg-gray-100'
              : 'text-gray-800 hover:text-primary'
          }`}
        >
          Group Trips
        </button>
        <button
          onClick={() => setActiveTab('creator')}
          className={`flex-1 text-xs sm:text-sm py-2 px-2.5 rounded-full font-medium transition-all duration-200 text-center cursor-pointer ${
            activeTab === 'creator'
              ? 'font-bold text-gray-950 bg-gray-100'
              : 'text-gray-800 hover:text-primary'
          }`}
        >
          Creator Trips
        </button>
      </div>
    </div>
  );
}
