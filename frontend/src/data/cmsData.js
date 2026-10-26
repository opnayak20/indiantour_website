import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

// ============================================================================
// 1. DEFAULT FOOTER & CONTACT SETTINGS
// ============================================================================
export const DEFAULT_CMS_FOOTER = {
  // Corporate Office Address
  corporateOffice: {
    heading: 'Corporate Office',
    line1: 'Shop No 7, Paras Apartment, Hospital Rd,',
    line2: 'opposite Ganatra Hospital, Lal Tekri,',
    line3: 'Bhuj, Gujarat 370001',
    mapUrl: 'https://maps.google.com/?q=Shop+No+7,+Paras+Apartment,+Hospital+Rd,+opposite+Ganatra+Hospital,+Lal+Tekri,+Bhuj,+Gujarat+370001'
  },
  // Main Branch Address
  mainBranch: {
    heading: 'Main Branch Address',
    line1: 'W35P+M9P, Road, Alipur',
    line2: 'Ibrahimpur Urf Ikk, Haridwar',
    line3: 'Uttarakhand 249402',
    mapUrl: 'https://maps.google.com/?q=W35P%2BM9P,+Alipur+Ibrahimpur+Urf+Ikk,+Haridwar,+Uttarakhand+249402'
  },
  // Floating Contact CTA Card (above footer)
  contactCta: {
    heading: "Don't wait any longer, Contact us!",
    subheading: 'Be part of our Social Media Journey!',
    phone: '95 48 436 762',
    whatsapp: '+919548436762',
    whatsappMessage: 'Hello, I want details about upcoming travel experiences.'
  },
  // Social Media Links
  socialLinks: {
    instagram: 'https://www.instagram.com/',
    youtube: 'https://www.youtube.com/',
    facebook: 'https://www.facebook.com/',
    twitter: 'https://www.x.com/',
    linkedin: 'https://www.linkedin.com/'
  },
  // Newsletter
  newsletter: {
    heading: 'Get Updates & more!',
    subtitle: 'Subscribe to the free newsletter and stay up to date.',
    placeholder: 'Your Email',
    buttonText: 'Subscribe'
  },
  // Copyright & Credits
  copyright: {
    text: '© 2026 India Tour Private Limited',
    tagline: 'Made with ❤️ in India 🇮🇳'
  }
};

// ============================================================================
// 2. DEFAULT HEADER & NAVIGATION SETTINGS
// ============================================================================
export const DEFAULT_CMS_HEADER = {
  announcement: {
    enabled: true,
    text: 'Get up to 6 months of No Cost EMI on your trips',
    highlight1: '0% Interest',
    highlight2: 'No Cards Required',
    actionText: 'Learn More',
    actionType: 'emi'
  },
  navbar: {
    brandName: 'India Tourism Live Travels',
    logoUrl: '/indiatournewlogo.jpg',
    contactPhone: '+91 95 48 436 762',
    packagesLabel: 'Tour Packages',
    groupTripsLabel: 'Group Trips',
    creatorTripsLabel: 'Creator Trips'
  }
};

// ============================================================================
// 3. DEFAULT HOMEPAGE CONTENT SETTINGS
// ============================================================================
export const DEFAULT_CMS_HOMEPAGE = {
  // Hero Carousel & Dynamic Persona Headline
  hero: {
    line1: 'Experiences for',
    touristImg: '/tourist-text.png',
    audienceWords: ['Travellers', 'Adventurers', 'Explorers', 'Families', 'Couples', 'Solo Travelers', 'Friends'],
    slides: [
      { image: '/hero-buddha.jpg', title: 'Spiti Valley Buddha Statue & Snowy Himalayan Peaks' },
      { image: 'https://images.unsplash.com/photo-1653844573020-71f77a0ccb8c?auto=format&fit=crop&w=2560&h=1440&q=90', title: 'Spiti Valley & Key Monastery Expedition' },
      { image: '/hero-ridge.jpg', title: 'Lush Tropical Ridge & Trail Expeditions' },
      { image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2560&h=1440&q=90', title: 'Paradise on Earth - Kashmir Valley' },
      { image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&h=1440&q=90', title: 'High Altitude Alpine Mountain Passes' }
    ]
  },
  // Search bar
  search: {
    placeholder: 'Search for destinations, tours or activities...',
    quickTags: ['Meghalaya', 'Kashmir', 'Thailand', 'Bali', 'Spiti', 'Kerala', 'Dubai', 'Vietnam']
  },
  // Seasonal Promo Sale Banner
  saleBanner: {
    badge: 'Limited Period Offer',
    title: 'Plan Your Winter Getaway',
    subtitle: 'Flat ₹4,000 Off on Early Bird Group Bookings with 0% Interest No Cost EMI',
    discountTag: 'Save up to ₹8,000 / person',
    code: 'WINTER2026',
    buttonText: 'Explore Deals ↗',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=85'
  },
  // Community / Group Expeditions Mid-Page Banner
  groupBanner: {
    desktopImg: 'https://img.indiatour.live/banner/desktop/community_trips.webp',
    mobileImg: 'https://img.indiatour.live/banner/mobile/community_trips.webp',
    title: 'Community Departures - Group Trips for 18-35 Year Olds',
    badge: 'Fixed Departure Groups'
  },
  // Why Choose Us Trust Pillars
  whyChooseUs: {
    heading: 'Why Travel With India Tour',
    subtitle: 'Crafted itineraries, certified trip captains, and hassle-free departures for unforgettable journeys.',
    pillar1Title: 'Certified Trip Captains',
    pillar1Desc: 'Experienced ground expedition leaders certified in safety and first-aid.',
    pillar2Title: 'Handpicked Premium Stays',
    pillar2Desc: 'Verified boutique resorts, scenic campsites, and comfortable private transfers.',
    pillar3Title: '100% Transparent Pricing',
    pillar3Desc: 'No hidden taxes or last-minute surprises. Flexible No Cost EMI available.',
    pillar4Title: '50,000+ Happy Explorers',
    pillar4Desc: 'Consistently rated 4.9/5 by solo travelers, couples, and adventure lovers.',
    stat1Value: '15,000+',
    stat1Label: 'Happy Explorers',
    stat2Value: '4.9 / 5.0',
    stat2Label: 'Average Traveler Rating',
    stat3Value: '250+',
    stat3Label: 'Curated Itineraries',
    stat4Value: '98%',
    stat4Label: 'Repeat & Referral Rate'
  }
};

// ============================================================================
// 4. DEFAULT PAGES CONTENT SETTINGS
// ============================================================================
export const DEFAULT_CMS_PAGES = {
  // Creator Trips Page
  creatorPage: {
    heroTitle: 'Experience Spiti Valley in Winter',
    heroSubtitle: 'Travel like Ananya Sharma',
    creatorName: 'Ananya Sharma',
    verifiedBadge: true,
    tagline: 'Celebrated mountain explorer & visual storyteller',
    aboutTitle: 'About this Itinerary',
    aboutText: "Welcome to an exclusive winter journey through Spiti Valley, inspired by Ananya Sharma's unforgettable Himalayan adventure. After capturing the hearts of travelers with her winter escape to Kashmir, Ananya set her sights on something even more raw, remote, and transformative — Spiti in winter. Braving frozen roads, sub-zero temperatures, and untouched trails, she experienced a side of the Himalayas few dare to explore.",
    hostHeading: 'Are you a travel creator or influencer?',
    hostSubtitle: 'Design your dream itinerary, invite your audience, and let our verified ground operations take care of logistics, safety, and bookings.',
    hostButton: 'Host a Trip With Us'
  },
  // Group Trips Page
  groupPage: {
    heroTitle: 'Curated Group Trips & Expeditions',
    heroSubtitle: 'Explore breathtaking mountains, exotic islands, and cultural trails with like-minded travelers.',
    badgeText: '100% Guaranteed Departures',
    exclusiveTitle: 'Creator-Led Group Expeditions',
    exclusiveDesc: 'Travel alongside celebrated photographers, content creators, and expert mountain leaders. Hand-crafted routes, small groups, and unforgettable moments.'
  },
  // Tour Packages Page
  packagesPage: {
    heroTitle: 'Handcrafted Tour Packages',
    heroSubtitle: 'Discover domestic and international holiday packages with customizable private itineraries.',
    badgeText: 'Verified India Tour Expeditions'
  },
  // No Cost EMI Modal
  emiModal: {
    title: 'No Cost EMI on All Trips',
    subtitle: 'Plan now, pay flexibly in easy monthly installments',
    point1Title: 'Up to 6 Months Zero Interest',
    point1Desc: 'No hidden charges, zero processing fees, and exact division of your package total.',
    point2Title: 'No Credit Card Needed',
    point2Desc: 'Eligible via UPI, debit card, or fast digital paperless verification in under 2 minutes.',
    point3Title: 'Applicable on All Experiences',
    point3Desc: 'Includes Spiti Valley, Leh Ladakh, Meghalaya, Vietnam, Bali, Kedarnath, and more.',
    whatsappButtonText: 'Chat on WhatsApp with EMI Advisor'
  },
  // About Us Page / Modal
  aboutUs: {
    title: 'About India Tourism Live Travels',
    subtitle: 'Crafting unforgettable adventures across India & beyond since 2018',
    badge: 'Our Story & Purpose',
    story: "India Tourism Live Travels was founded with a single mission: to make authentic, immersive, and transformative travel accessible to every explorer. From the snowbound valleys of Spiti and the frozen wonders of Kashmir, to the pristine rainforests of Meghalaya and the tropical waters of Bali and Vietnam, we curate end-to-end expeditions led by certified ground experts.",
    mission: "We believe travel should be more than sightseeing. It should create lifelong bonds, support local mountain communities, and offer stress-free journeys backed by transparent pricing and 24x7 safety protocols.",
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85'
  },
  // Terms and Conditions Page / Modal
  termsAndConditions: {
    title: 'Terms & Conditions',
    lastUpdated: 'October 2026',
    content: "1. Booking & Permits: A valid Government ID (Aadhaar / Passport) is mandatory for permits and hotel check-ins.\n2. Itinerary Alterations: Mountain expeditions are subject to weather conditions, snowfall, and BRO road clearance. The tour leader reserves the right to alter schedules for group safety.\n3. Traveler Code of Conduct: Participants are expected to maintain respect towards local mountain communities and fellow travelers.\n4. Liability: India Tour is not responsible for personal belongings or flight delays caused by external weather factors."
  },
  // Privacy Policy Page / Modal
  privacyPolicy: {
    title: 'Privacy Policy',
    lastUpdated: 'October 2026',
    content: "1. Information Collection: We collect only the information necessary to fulfill your bookings, process government inner-line permits, and provide 24x7 customer support.\n2. Data Security: Your personal data, payment details, and contact numbers are encrypted and never sold to third-party advertisers.\n3. Communications: We only send itinerary updates, booking confirmations, and important departure advisories via WhatsApp and Email.\n4. Traveler Rights: You may request deletion or updates to your traveler profile at any time by contacting our support team."
  },
  // Cancellation and Refund Policy Page / Modal
  cancellationPolicy: {
    title: 'Cancellation & Refund Policy',
    lastUpdated: 'October 2026',
    content: "1. 30+ Days Prior to Departure: 90% cash refund or 100% lifetime travel credit voucher.\n2. 15 to 29 Days Prior to Departure: 50% refund.\n3. Less than 15 Days: Non-refundable due to advance hotel lock-ins and vehicle reservations.\n4. Force Majeure: In the event of trip cancellation by organizers due to extreme weather, road closures, or natural calamities, a 100% lifetime credit shell is issued.\n5. No Cost EMI: EMI refunds are processed back to the original funding account within 5-7 banking days."
  }
};

// Map of default configurations
const CMS_DEFAULTS = {
  footer: DEFAULT_CMS_FOOTER,
  header: DEFAULT_CMS_HEADER,
  homepage: DEFAULT_CMS_HOMEPAGE,
  pages: DEFAULT_CMS_PAGES
};

// ============================================================================
// GET CMS DATA (From LocalStorage with fallback to defaults)
// ============================================================================
export function getCmsData(sectionKey) {
  try {
    const raw = localStorage.getItem(`cms_${sectionKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(CMS_DEFAULTS[sectionKey] || {}, parsed);
    }
  } catch (err) {
    console.warn(`Error reading CMS data for ${sectionKey}:`, err);
  }
  return CMS_DEFAULTS[sectionKey] || {};
}

// ============================================================================
// SAVE CMS DATA (Writes to LocalStorage, syncs to Backend & broadcasts events)
// ============================================================================
export async function saveCmsData(sectionKey, data) {
  try {
    localStorage.setItem(`cms_${sectionKey}`, JSON.stringify(data));
    
    // Broadcast custom event for immediate in-page reactivity
    window.dispatchEvent(new CustomEvent('cms-content-updated', {
      detail: { sectionKey, data }
    }));
    
    // Dispatch StorageEvent for cross-tab reactivity
    window.dispatchEvent(new StorageEvent('storage', {
      key: `cms_${sectionKey}`,
      newValue: JSON.stringify(data)
    }));

    // Persist to backend database via admin API
    const adminToken = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (adminToken) {
      fetch(`${API_BASE}/admin/cms.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ section: sectionKey, data })
      }).catch(err => console.warn('CMS backend sync error:', err));
    }

    return true;
  } catch (err) {
    console.error(`Error saving CMS data for ${sectionKey}:`, err);
    return false;
  }
}

// ============================================================================
// RESET CMS DATA TO DEFAULTS
// ============================================================================
export function resetCmsData(sectionKey) {
  try {
    localStorage.removeItem(`cms_${sectionKey}`);
    const defaultData = CMS_DEFAULTS[sectionKey] || {};
    
    window.dispatchEvent(new CustomEvent('cms-content-updated', {
      detail: { sectionKey, data: defaultData }
    }));
    window.dispatchEvent(new StorageEvent('storage', {
      key: `cms_${sectionKey}`,
      newValue: JSON.stringify(defaultData)
    }));

    const adminToken = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (adminToken) {
      fetch(`${API_BASE}/admin/cms.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ section: sectionKey, data: defaultData })
      }).catch(() => {});
    }

    return defaultData;
  } catch (err) {
    console.error(`Error resetting CMS data for ${sectionKey}:`, err);
    return CMS_DEFAULTS[sectionKey] || {};
  }
}

// ============================================================================
// INITIALIZE CMS SYNC (Loads backend settings into localStorage on site load)
// ============================================================================
export function initCmsSync() {
  if (typeof window === 'undefined') return;
  fetch(`${API_BASE}/cms.php`)
    .then(res => res.json())
    .then(data => {
      if (data?.data && typeof data.data === 'object') {
        Object.keys(data.data).forEach(sectionKey => {
          const sectionVal = data.data[sectionKey];
          if (sectionVal && typeof sectionVal === 'object' && Object.keys(sectionVal).length > 0) {
            const current = getCmsData(sectionKey);
            const merged = deepMerge(current, sectionVal);
            localStorage.setItem(`cms_${sectionKey}`, JSON.stringify(merged));
            window.dispatchEvent(new CustomEvent('cms-content-updated', {
              detail: { sectionKey, data: merged }
            }));
          }
        });
      }
    })
    .catch(() => {});
}

// ============================================================================
// REACT HOOK: USE CMS DATA
// ============================================================================
export function useCmsData(sectionKey) {
  const [data, setData] = useState(() => getCmsData(sectionKey));

  useEffect(() => {
    const handleCustomEvent = (e) => {
      if (!e.detail || e.detail.sectionKey === sectionKey) {
        setData(getCmsData(sectionKey));
      }
    };

    const handleStorageEvent = (e) => {
      if (e.key === `cms_${sectionKey}`) {
        setData(getCmsData(sectionKey));
      }
    };

    window.addEventListener('cms-content-updated', handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('cms-content-updated', handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [sectionKey]);

  return data;
}

// Deep merge helper
function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
