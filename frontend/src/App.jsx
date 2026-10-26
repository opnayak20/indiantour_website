import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import MobilePillNav from './components/MobilePillNav';
import CategorySlider from './components/CategorySlider';
import HeroCarousel from './components/HeroCarousel';
import TrendingSection from './components/TrendingSection';
import VideoBannerSection from './components/VideoBannerSection';
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
import PolicyModal from './components/PolicyModal';
import SearchBar from './components/SearchBar';
import WhyChooseUs from './components/WhyChooseUs';
import DestinationPage from './components/DestinationPage';
import { groupTripsList } from './data/groupTripsData';
import { allTourPackages } from './data/tourPackagesData';
import { DESTINATIONS_DATA } from './data/destinationsData';
import { API_BASE } from './config/api';
import { initCmsSync } from './data/cmsData';

const allDestinationPackages = Object.values(DESTINATIONS_DATA).flatMap(
  (dest) => dest?.allPackages || []
);

const allAvailableTours = [...groupTripsList, ...allTourPackages, ...allDestinationPackages];

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
  whatsappNumber: '+919548436762'
};

function parseRouteFromLocation() {
  if (typeof window === 'undefined') {
    return {
      isAdmin: false,
      tab: 'packages',
      destination: null,
      tourId: null
    };
  }

  const pathname = window.location.pathname.toLowerCase();
  const cleanPath = pathname.replace(/^\/|\/$/g, '');
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();

  // 1. Admin check (/admin or #admin)
  if (cleanPath === 'admin' || cleanPath.startsWith('admin/') || hash.includes('admin')) {
    try {
      const storedUser = JSON.parse(localStorage.getItem('india_tour_user'));
      if (storedUser && storedUser.role !== 'admin') {
        return { isAdmin: false, tab: 'packages', destination: null, tourId: null };
      }
    } catch {}
    return { isAdmin: true, tab: 'packages', destination: null, tourId: null };
  }

  // 2. Tour check (/tours/:slug or ?tour=:slug)
  let tourId = params.get('tour');
  if (!tourId) {
    if (cleanPath.startsWith('tours/') || cleanPath.startsWith('tour/')) {
      const parts = cleanPath.split('/');
      tourId = parts[1] || null;
    }
  }

  // 3. Destination check (/kashmir, /thailand, /meghalaya or ?dest=)
  let destination = null;
  if (DESTINATIONS_DATA[cleanPath]) {
    destination = cleanPath;
  } else {
    const destParam = (params.get('dest') || params.get('destination') || '').toLowerCase();
    if (destParam && DESTINATIONS_DATA[destParam]) {
      destination = destParam;
    }
  }

  // 4. Tab check (/group-trips, /creator-trips, /tour-packages or ?tab=)
  let tab = 'packages';
  const tabParam = (params.get('tab') || '').toLowerCase();
  if (
    cleanPath === 'group-trips' ||
    cleanPath === 'group' ||
    cleanPath.startsWith('group-trips/') ||
    tabParam === 'group-trips' ||
    tabParam === 'group'
  ) {
    tab = 'group';
  } else if (
    cleanPath === 'creator-trips' ||
    cleanPath === 'creator' ||
    cleanPath.startsWith('creator-trips/') ||
    cleanPath.startsWith('creator/') ||
    tabParam === 'creator-trips' ||
    tabParam === 'creator'
  ) {
    tab = 'creator';
  }

  return {
    isAdmin: false,
    tab,
    destination,
    tourId
  };
}

export default function App() {
  const initialRoute = parseRouteFromLocation();

  const [isAdminView, setIsAdminView] = useState(initialRoute.isAdmin);
  const [activeTab, setActiveTab] = useState(initialRoute.tab);
  const [selectedDestination, setSelectedDestination] = useState(initialRoute.destination);
  const [selectedTour, setSelectedTour] = useState(() => {
    if (initialRoute.tourId) {
      const q = initialRoute.tourId.toLowerCase();
      return (
        allAvailableTours.find(
          (t) =>
            (t.id && String(t.id).toLowerCase() === q) ||
            (t.slug && String(t.slug).toLowerCase() === q) ||
            (t.link && t.link.toLowerCase().endsWith('/' + q))
        ) || null
      );
    }
    return null;
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [policyModalType, setPolicyModalType] = useState(null); // 'about' | 'terms' | 'privacy' | 'cancellation'

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

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('india_tour_user')) || null;
    } catch {
      return null;
    }
  });

  // Listen to standard browser popstate (back/forward history navigation) & Sync CMS
  useEffect(() => {
    initCmsSync();

    // Strip hash if present
    if (typeof window !== 'undefined' && window.location.hash) {
      if (window.location.hash.toLowerCase().includes('admin')) {
        window.history.replaceState(null, '', '/admin');
      } else {
        window.history.replaceState(null, '', window.location.pathname || '/');
      }
    }

    const syncRoute = () => {
      const route = parseRouteFromLocation();
      try {
        const storedUser = JSON.parse(localStorage.getItem('india_tour_user'));
        if (route.isAdmin && storedUser && storedUser.role !== 'admin') {
          setIsAdminView(false);
          window.history.replaceState(null, '', '/');
          return;
        }
      } catch {}

      setIsAdminView(route.isAdmin);
      setSelectedDestination(route.destination);
      setActiveTab(route.tab);

      if (route.tourId) {
        const q = route.tourId.toLowerCase();
        const found = allAvailableTours.find(
          (t) =>
            (t.id && String(t.id).toLowerCase() === q) ||
            (t.slug && String(t.slug).toLowerCase() === q) ||
            (t.link && t.link.toLowerCase().endsWith('/' + q))
        );
        setSelectedTour(found || null);
      } else {
        setSelectedTour(null);
      }
    };

    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const handleOpenAdmin = () => {
    // Normal non-admin travelers cannot open admin
    if (currentUser && currentUser.role !== 'admin') {
      return;
    }
    setSelectedTour(null);
    setSelectedDestination(null);
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({ admin: true }, '', '/admin');
    } catch {}
  };

  const handleExitAdmin = () => {
    setIsAdminView(false);
    setSelectedTour(null);
    setSelectedDestination(null);
    setActiveTab('packages');
    // Clear admin active session so returning to /admin cannot auto-login
    try {
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState(null, '', '/');
    } catch {}
  };

  const handleTabChange = (tab) => {
    setSelectedTour(null);
    setSelectedDestination(null);
    setIsAdminView(false);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const url = tab === 'group' ? '/group-trips' : tab === 'creator' ? '/creator-trips' : '/';
      window.history.pushState({ tab }, '', url);
    } catch {}
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('india_tour_user', JSON.stringify(user));
    } catch {}
    // Do not auto-login or auto-open admin console; stay on website
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('india_tour_user');
    localStorage.removeItem('india_tour_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_token');
  };

  const handleSelectDestination = (destSlug) => {
    const slug = (destSlug || '').toLowerCase();
    if (DESTINATIONS_DATA[slug]) {
      setSelectedTour(null);
      setSelectedDestination(slug);
      setIsAdminView(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
      try {
        window.history.pushState({ dest: slug }, '', `/${slug}`);
      } catch {}
    }
  };

  const handleNavigateHome = () => {
    setSelectedTour(null);
    setSelectedDestination(null);
    setActiveTab('packages');
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState(null, '', '/');
    } catch {}
  };

  const handleCategorySelect = (slug) => {
    const lower = (slug || '').toLowerCase();
    if (DESTINATIONS_DATA[lower]) {
      handleSelectDestination(lower);
      return;
    }
    const nextCategory = slug === selectedCategory ? null : slug;
    setSelectedCategory(nextCategory);

    // If currently viewing another page (Tour details, Destination page, Creator or Group trips),
    // navigate to the main packages view so the user sees the filtered packages
    if (selectedTour || selectedDestination || activeTab !== 'packages') {
      setSelectedTour(null);
      setSelectedDestination(null);
      setActiveTab('packages');
      try {
        window.history.pushState(null, '', '/');
      } catch {}
    }

    // Smooth scroll to trending or packages section
    setTimeout(() => {
      const elem = document.getElementById('trending-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
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
    if (!tour) return;
    const destKey = (tour.slug || tour.name || '').toLowerCase();
    if (DESTINATIONS_DATA[destKey]) {
      handleSelectDestination(destKey);
      return;
    }

    const richTour =
      allAvailableTours.find(
        (t) =>
          (t.slug && tour.slug && t.slug === tour.slug) ||
          (t.id && tour.id && String(t.id) === String(tour.id)) ||
          (t.title && tour.title && t.title.toLowerCase() === tour.title.toLowerCase())
      ) || tour;

    setSelectedTour(richTour);
    window.scrollTo({ top: 0, behavior: 'instant' });
    try {
      const tourParam = richTour.slug || richTour.id;
      window.history.pushState({ tour: tourParam }, '', `?tour=${tourParam}`);
    } catch {}
  };

  const handleCloseTour = () => {
    setSelectedTour(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (selectedDestination) {
        window.history.pushState({ dest: selectedDestination }, '', `/${selectedDestination}`);
      } else {
        const url = activeTab === 'group' ? '/group-trips' : activeTab === 'creator' ? '/creator-trips' : '/';
        window.history.pushState({ tab: activeTab }, '', url);
      }
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
        onNavigateHome={handleNavigateHome}
      />

      {/* 3. Mobile Segmented Nav Pills (Mobile-Only) */}
      <MobilePillNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* 4. India Tour-Style Destination & Category Icons Slider (Persistent across EVERY page) */}
      <CategorySlider
        selectedCategory={selectedCategory || selectedDestination}
        onSelectCategory={handleCategorySelect}
      />

      <main className="flex-1">
        {selectedTour ? (
          <TourDetailsModal
            key={selectedTour.id || selectedTour.slug || selectedTour.title}
            tour={selectedTour}
            onClose={handleCloseTour}
          />
        ) : selectedDestination && DESTINATIONS_DATA[selectedDestination] ? (
          <DestinationPage
            destinationData={DESTINATIONS_DATA[selectedDestination]}
            onSelectPackage={handleTourSelect}
            onNavigateHome={handleNavigateHome}
            onNavigateDestination={handleSelectDestination}
            onOpenEmiModal={() => setIsEmiModalOpen(true)}
          />
        ) : activeTab === 'creator' ? (
          <CreatorTripPage />
        ) : activeTab === 'group' ? (
          <GroupTripsPage
            onTripSelect={handleTourSelect}
          />
        ) : (
          <>
            {/* 5. Hero Carousel with Dynamic Typography & Buddha Statue */}
            <HeroCarousel
              onCtaClick={() => setIsEmiModalOpen(true)}
            />

            {/* 6. India Tour-Style Floating Search & Quick Tags */}
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

            {/* 8. India Tour Experience Travel Video Banner */}
            <VideoBannerSection onBannerClick={handleTourSelect} />

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

            {/* 13. Why Travel With Us (India Tour Experiences Trust Pillars) */}
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
        onOpenPolicyModal={setPolicyModalType}
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

      {/* Dynamic Policy & Informational Modal (About Us, Terms, Privacy, Cancellation) */}
      <PolicyModal
        isOpen={Boolean(policyModalType)}
        type={policyModalType}
        onClose={() => setPolicyModalType(null)}
        onOpenEmiModal={() => {
          setPolicyModalType(null);
          setIsEmiModalOpen(true);
        }}
      />

    </div>
  );
}
