import React, { useState } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import MobilePillNav from './components/MobilePillNav';
import CategorySlider from './components/CategorySlider';
import HeroCarousel from './components/HeroCarousel';
import TrendingSection from './components/TrendingSection';
import PromoBannerSale from './components/PromoBannerSale';
import InternationalDestinations from './components/InternationalDestinations';
import DomesticDestinations from './components/DomesticDestinations';
import PromoBannerGroup from './components/PromoBannerGroup';
import WatchAndRead from './components/WatchAndRead';
import ReviewsSection from './components/ReviewsSection';
import ContactCta from './components/ContactCta';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import EmiModal from './components/EmiModal';
import AuthModal from './components/AuthModal';
import TourDetailsModal from './components/TourDetailsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('packages'); // packages | group | creator
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug === selectedCategory ? null : slug);
    // Smooth scroll to trending or packages section
    const elem = document.getElementById('trending-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTourSelect = (tour) => {
    setSelectedTour(tour);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased selection:bg-red-500 selection:text-white">
      
      {/* 1. Top Offer / Announcement Bar */}
      <AnnouncementBar onOpenEmiModal={() => setIsEmiModalOpen(true)} />

      {/* 2. Primary Navigation Header */}
      <Navbar
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 3. Mobile Segmented Nav Pills (Mobile-Only) */}
      <MobilePillNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1">
        {/* 4. Quick Destination / Category Filters */}
        <CategorySlider
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {/* 5. Hero Carousel with Dynamic Typography */}
        <HeroCarousel
          onCtaClick={() => setIsEmiModalOpen(true)}
        />

        {/* 6. Trending Packages Section */}
        <div id="trending-section">
          <TrendingSection onPackageSelect={handleTourSelect} />
        </div>

        {/* 7. Mid-Page Overlapping Banner: Sale of the Season */}
        <PromoBannerSale
          onBannerClick={() => setIsEmiModalOpen(true)}
        />

        {/* 8. International Destinations Carousel */}
        <div id="international-section">
          <InternationalDestinations onDestinationSelect={handleTourSelect} />
        </div>

        {/* 9. Domestic Destinations Carousel */}
        <div id="domestic-section">
          <DomesticDestinations onDestinationSelect={handleTourSelect} />
        </div>

        {/* 10. Mid-Page Overlapping Banner: Group Expeditions */}
        <PromoBannerGroup
          onBannerClick={() => setActiveTab('group')}
        />

        {/* 11. Watch & Read (Stories, Guides & Tips) */}
        <div id="watch-read-section">
          <WatchAndRead onStorySelect={handleTourSelect} />
        </div>

        {/* 12. Reviews & Customer Testimonials */}
        <div id="reviews-section">
          <ReviewsSection onViewAllReviews={() => setIsAuthModalOpen(true)} />
        </div>

        {/* 13. Elevated Contact & Social CTA Card */}
        <ContactCta />
      </main>

      {/* 14. Comprehensive Footer */}
      <Footer onLinkClick={handleTourSelect} />

      {/* 15. Floating Quick Action Buttons (WhatsApp & Call) */}
      <FloatingActions />

      {/* Interactive Modals */}
      <EmiModal
        isOpen={isEmiModalOpen}
        onClose={() => setIsEmiModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <TourDetailsModal
        tour={selectedTour}
        onClose={() => setSelectedTour(null)}
      />

    </div>
  );
}
