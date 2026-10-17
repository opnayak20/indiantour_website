import React, { useState, useEffect } from 'react';
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
import EmiModal from './components/EmiModal';
import AuthModal from './components/AuthModal';
import TourDetailsModal from './components/TourDetailsModal';
import AdminDashboard from './components/AdminDashboard';
import GroupTripsPage from './components/GroupTripsPage';
import CreatorTripPage from './components/CreatorTripPage';
import TourPackagesPage from './components/TourPackagesPage';
import TripLeadModal from './components/TripLeadModal';
import SearchBar from './components/SearchBar';
import WhyChooseUs from './components/WhyChooseUs';
import { groupTripsList } from './data/groupTripsData';
import { allTourPackages } from './data/tourPackagesData';
import { API_BASE } from './config/api';

const allAvailableTours = [...groupTripsList, ...allTourPackages];

const DEFAULT_POPUP_CONFIG = {
  enabled: true,
  triggerOnGroupTrips: false, // Do NOT open when user opens group page
  triggerOnCreatorTrips: false,
  triggerOnPackageClick: true, // Only open when user opens a particular trip package
  delaySeconds: 10, // 10 seconds delay on page
  showFrequency: 'always',
  defaultTitle: 'Meghalaya Tour Package',
  defaultDuration: '6 Days 5 Nights',
  defaultSubtitle: 'Krem Chympe, Waterfalls & Root Bridges',
  defaultImage: '/meghalaya_root_bridge.jpg',
  badgeText: 'No Cost EMI options available ↗',
  badgeAction: 'open_emi_modal',
  formHeading: 'Plan Your Next Trip',
  buttonText: 'Connect with Expert',
  buttonColor: '#e52b2b',
  whatsappNumber: '+919099599331'
};

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'group-trips' || tabParam === 'group') return 'group';
      if (tabParam === 'creator' || tabParam === 'creator-trips') return 'creator';
    }
    return 'packages';
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tourParam = params.get('tour');
      if (tourParam) {
        return allAvailableTours.find((t) => t.id === tourParam || t.slug === tourParam) || null;
      }
    }
    return null;
  });

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    const elem = document.getElementById('trending-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };


  // Dynamic Trip Lead Popup States
  const [popupSettings, setPopupSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('india_tour_popup_settings');
      if (stored) return { ...DEFAULT_POPUP_CONFIG, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_POPUP_CONFIG;
  });
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalTour, setLeadModalTour] = useState(null);
  
  // Clean path-based routing (HTML5 History API)
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      // If user arrives with a legacy #admin hash, strip it and normalize to clean /admin
      if (window.location.hash.toLowerCase().includes('admin')) {
        window.history.replaceState(null, '', '/admin');
        return true;
      }
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname || '/');
      }
      const path = window.location.pathname.toLowerCase();
      return path === '/admin' || path.startsWith('/admin/') || path.startsWith('/admin');
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('india_tour_user')) || null;
    } catch {
      return null;
    }
  });

  // Listen to standard browser popstate (back/forward history navigation)
  useEffect(() => {
    // Strip any lingering hash on initial mount
    if (typeof window !== 'undefined' && window.location.hash) {
      if (window.location.hash.toLowerCase().includes('admin')) {
        window.history.replaceState(null, '', '/admin');
      } else {
        window.history.replaceState(null, '', window.location.pathname || '/');
      }
    }

    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      setIsAdminView(path === '/admin' || path.startsWith('/admin/') || path.startsWith('/admin'));
      const params = new URLSearchParams(window.location.search);
      const tourParam = params.get('tour');
      if (!tourParam) {
        setSelectedTour(null);
      } else {
        const found = allAvailableTours.find((t) => t.id === tourParam || t.slug === tourParam);
        if (found) setSelectedTour(found);
      }
      const tabParam = params.get('tab');
      if (tabParam === 'group-trips' || tabParam === 'group') {
        setActiveTab('group');
      } else if (tabParam === 'creator' || tabParam === 'creator-trips') {
        setActiveTab('creator');
      } else {
        setActiveTab('packages');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleOpenAdmin = () => {
    window.history.pushState(null, '', '/admin');
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitAdmin = () => {
    window.history.pushState(null, '', '/');
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    setSelectedTour(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const tabParam = tab === 'group' ? '?tab=group-trips' : tab === 'creator' ? '?tab=creator-trips' : window.location.pathname;
      window.history.pushState(null, '', tabParam);
    } catch {}
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('india_tour_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    if (user?.role === 'admin') {
      handleOpenAdmin();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('india_tour_user');
    localStorage.removeItem('india_tour_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug === selectedCategory ? null : slug);
    // Smooth scroll to trending or packages section
    const elem = document.getElementById('trending-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sync popup settings with backend & localStorage
  useEffect(() => {
    fetch(`${API_BASE}/popup_settings.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setPopupSettings((prev) => ({ ...prev, ...data.data }));
          localStorage.setItem('india_tour_popup_settings', JSON.stringify(data.data));
        }
      })
      .catch(() => {});

    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('india_tour_popup_settings');
        if (stored) setPopupSettings((prev) => ({ ...prev, ...JSON.parse(stored) }));
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Trigger pop-up after configured delay (default 20s or trip-specific delay) when user opens that particular group trip package
  useEffect(() => {
    if (!selectedTour || !popupSettings?.enabled || !popupSettings?.triggerOnPackageClick) {
      return;
    }

    const tourId = selectedTour?.id || selectedTour?.slug;
    const tripOverride = tourId && popupSettings?.tripOverrides?.[tourId];

    // If pop-up is explicitly disabled for this particular trip, do not open
    if (tripOverride && tripOverride.enabled === false) {
      return;
    }

    // Trip-specific delay override if defined, else global delay (default 10s)
    let delaySec = 10;
    if (tripOverride && typeof tripOverride.customDelay === 'number' && tripOverride.customDelay >= 0) {
      delaySec = tripOverride.customDelay;
    } else if (typeof popupSettings.delaySeconds === 'number') {
      delaySec = popupSettings.delaySeconds;
    }

    const delayMs = Math.max(1000, delaySec * 1000);

    const timer = setTimeout(() => {
      // Pop-up specifically regarding this particular opened trip!
      setLeadModalTour(selectedTour);
      setIsLeadModalOpen(true);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedTour, popupSettings]);

  // When user clicks/opens any package or group trip -> Opens as full dedicated page!
  const handleTourSelect = (tour) => {
    setSelectedTour(tour);
    window.scrollTo({ top: 0, behavior: 'instant' });
    try {
      const tourParam = tour.slug || tour.id;
      window.history.pushState({ tour: tourParam }, '', `?tour=${tourParam}`);
    } catch {}
  };

  const handleCloseTour = () => {
    setSelectedTour(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const tabParam = activeTab === 'group' ? '?tab=group-trips' : activeTab === 'creator' ? '?tab=creator-trips' : window.location.pathname;
      window.history.pushState(null, '', tabParam);
    } catch {}
  };

  if (isAdminView) {
    return <AdminDashboard onExitAdmin={handleExitAdmin} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased selection:bg-[#ec1d24] selection:text-white">
      
      {/* 1. Top Offer / Announcement Bar */}
      <AnnouncementBar onOpenEmiModal={() => setIsEmiModalOpen(true)} />

      {/* 2. Primary Navigation Header */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* 3. Mobile Segmented Nav Pills (Mobile-Only) */}
      <MobilePillNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      <main className="flex-1">
        {selectedTour ? (
          <TourDetailsModal
            tour={selectedTour}
            onClose={handleCloseTour}
          />
        ) : activeTab === 'creator' ? (
          <CreatorTripPage />
        ) : activeTab === 'group' ? (
          <GroupTripsPage
            onTripSelect={handleTourSelect}
          />
        ) : (
          <>
            {/* 4. Quick Destination / Category Filters */}
            <CategorySlider
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />

            {/* 5. Hero Carousel with Dynamic Typography & Buddha Statue */}
            <HeroCarousel
              onCtaClick={() => setIsEmiModalOpen(true)}
            />

            {/* 6. Avian-Style Floating Search & Quick Tags */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onQuickSelect={handleQuickSearch}
            />

            {/* 7. Trending Packages Section */}
            <div id="trending-section">
              <TrendingSection
                onPackageSelect={handleTourSelect}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onClearFilter={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
              />
            </div>

            {/* 8. Mid-Page Overlapping Banner: Sale of the Season */}
            <PromoBannerSale
              onBannerClick={() => setIsEmiModalOpen(true)}
            />

            {/* 9. International Destinations Carousel */}
            <div id="international-section">
              <InternationalDestinations onDestinationSelect={handleTourSelect} />
            </div>

            {/* 10. Domestic Destinations Carousel */}
            <div id="domestic-section">
              <DomesticDestinations onDestinationSelect={handleTourSelect} />
            </div>

            {/* 11. Mid-Page Overlapping Banner: Group Expeditions */}
            <PromoBannerGroup
              onBannerClick={() => handleTabChange('group')}
            />

            {/* 12. Watch & Read (Stories, Guides & Tips) */}
            <div id="watch-read-section">
              <WatchAndRead onStorySelect={handleTourSelect} />
            </div>

            {/* 13. Why Travel With Us (Avian Experiences Trust Pillars) */}
            <WhyChooseUs onExploreClick={() => handleTabChange('group')} />

            {/* 14. Reviews & Customer Testimonials */}
            <div id="reviews-section">
              <ReviewsSection onViewAllReviews={() => setIsAuthModalOpen(true)} />
            </div>
          </>
        )}

        {/* 13. Elevated Contact & Social CTA Card */}
        <ContactCta />
      </main>

      {/* 14. Comprehensive Footer */}
      <Footer
        onLinkClick={handleTourSelect}
        onNavigateTab={handleTabChange}
        onOpenEmiModal={() => setIsEmiModalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Interactive Modals */}
      <EmiModal
        isOpen={isEmiModalOpen}
        onClose={() => setIsEmiModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Dynamic Trip Lead Pop-up (Screenshot Layout) */}
      <TripLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        tour={leadModalTour}
        popupSettings={popupSettings}
        onOpenEmiModal={() => setIsEmiModalOpen(true)}
      />

    </div>
  );
}
