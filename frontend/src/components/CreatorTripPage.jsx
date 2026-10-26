import React, { useState } from 'react';
import { API_BASE } from '../config/api';
import { useCmsData } from '../data/cmsData';
import LazyImage from './LazyImage';

// Curated Photos matching the 5-photo mosaic grid (High-speed CloudFront CDN WebP)
const CREATOR_PHOTOS = [
  {
    url: 'https://img.indiatour.live/trek/a2199543-ae66-4cd1-8013-4632f393a1b8/Winter_Spiti_01.webp',
    title: 'Frozen Waterfall at Spiti Valley',
    caption: 'Majestic ice formations and frozen cascades near Kaza'
  },
  {
    url: 'https://img.indiatour.live/trek/987f7011-6106-4c6f-a526-a46d706497dc/Winter_Spiti_02.webp',
    title: 'Langza Buddha Statue',
    caption: 'Golden statue of Lord Buddha overlooking snow-clad peaks'
  },
  {
    url: 'https://img.indiatour.live/trek/ba5e9d18-6e69-4a7d-a44c-bcfa38c79844/Winter_Spiti_04.webp',
    title: 'Himalayan Snowscape',
    caption: 'Breathtaking white horizon across Kinnaur and Spiti'
  },
  {
    url: 'https://img.indiatour.live/trek/03722d76-bdc1-41db-8b36-25e76e4dbd1b/Winter_Spiti_05.webp',
    title: 'Tibetan Prayer Flags on Ridge',
    caption: 'Wind-blown colorful flags at Kunzum Pass'
  },
  {
    url: 'https://img.indiatour.live/trek/bcd7ce32-bbbc-418b-86e9-17a69b595477/Winter_Spiti_03.webp',
    title: 'High-Altitude Pass Summit',
    caption: 'Standing on top of the world at 14,500 ft'
  }
];

const HIGHLIGHT_CARDS = [
  {
    img: 'https://img.indiatour.live/trek/a2199543-ae66-4cd1-8013-4632f393a1b8/Winter_Spiti_01.webp',
    title: 'Kunzum Pass Prayer Flags',
    subtitle: 'Gateway to Spiti'
  },
  {
    img: 'https://img.indiatour.live/trek/987f7011-6106-4c6f-a526-a46d706497dc/Winter_Spiti_02.webp',
    title: 'Frozen Spiti River Bed',
    subtitle: 'Winter Silence'
  },
  {
    img: 'https://img.indiatour.live/trek/ba5e9d18-6e69-4a7d-a44c-bcfa38c79844/Winter_Spiti_04.webp',
    title: 'Key Monastery in Snow',
    subtitle: '1000-Year Heritage'
  },
  {
    img: 'https://img.indiatour.live/trek/03722d76-bdc1-41db-8b36-25e76e4dbd1b/Winter_Spiti_05.webp',
    title: 'Langza Ancient Village',
    subtitle: 'Fossil Hunting'
  },
  {
    img: 'https://img.indiatour.live/trek/bcd7ce32-bbbc-418b-86e9-17a69b595477/Winter_Spiti_03.webp',
    title: 'Hikkim Highest Post Office',
    subtitle: 'Letter to Loved Ones'
  }
];

const ITINERARY_DAYS = [
  {
    day: 1,
    title: 'Arrival in Chandigarh & Travel to Narkanda',
    desc: 'Meet your expedition leader Ananya Sharma and fellow travelers at Chandigarh Airport/Railway Station by 10:00 AM. Board your heated tempo traveler and begin the winding ascent into the Himalayas through Shimla to the apple orchard hamlet of Narkanda.',
    stay: 'Boutique Hotel in Narkanda',
    meals: 'Dinner Included'
  },
  {
    day: 2,
    title: 'Travel from Narkanda to Sangla',
    desc: 'Drive along the dramatic Hindustan-Tibet Highway through the Sutlej River gorge. Enter the enchanting Baspa Valley and reach the riverside village of Sangla. Evening walk through wood-carved temples and local apple orchards.',
    stay: 'Deluxe Riverside Camp/Hotel in Sangla',
    meals: 'Breakfast & Dinner'
  },
  {
    day: 3,
    title: 'Journey towards Nako & Kalpa',
    desc: 'Witness the sunrise over the sacred Kinner Kailash peak. Drive to Chitkul, the last inhabited village on the Indo-Tibetan border. Proceed along Khab Sangam (confluence of Spiti & Sutlej rivers) to reach the frozen lake village of Nako.',
    stay: 'Heritage Homestay in Nako/Kalpa',
    meals: 'Breakfast & Dinner'
  },
  {
    day: 4,
    title: 'Nako to Kaza travel via Khab Sangam & Nako Lake',
    desc: 'Walk on the frozen perimeter of Nako Lake. Enter Spiti Valley through the dramatic gate of Sumdo. Visit the 500-year-old preserved natural mummy at Gue village before arriving in Kaza, the commercial heart of Spiti.',
    stay: 'Insulated Hotel with Bukhari in Kaza',
    meals: 'Breakfast & Dinner'
  },
  {
    day: 5,
    title: 'Drive to Kaza through Chicham & Kibber',
    desc: 'Cross Chicham Bridge—Asia’s highest suspension gorge bridge at 13,596 ft. Visit Kibber wildlife sanctuary, famous for Himalayan blue sheep and snow leopard sightings. Warm up with butter tea in a traditional mud-brick home.',
    stay: 'Hotel in Kaza',
    meals: 'Breakfast & Dinner'
  },
  {
    day: 6,
    title: 'Day for Key, Kibber and Chicham visit',
    desc: 'Explore the iconic Key Monastery perched like a fortress atop a conical hill. Sit in the morning prayer hall with chanting Buddhist lamas, admire ancient murals, and soak in panoramic valley vistas.',
    stay: 'Hotel in Kaza',
    meals: 'Breakfast & Dinner'
  },
  {
    day: 7,
    title: 'Day for Hikkim, Komic and Langza visit',
    desc: 'Visit Hikkim (14,567 ft) and send handwritten postcards from the World’s Highest Post Office. Continue to Komic, the world’s highest motorable village, and pose with the gigantic golden Buddha statue in Langza.',
    stay: 'Hotel in Kaza',
    meals: 'Breakfast & Dinner'
  },
  {
    day: 8,
    title: 'Kaza to Kalpa travel via Tabo & Gue',
    desc: 'Descend through the ancient monastery village of Tabo, often celebrated as the "Ajanta of the Himalayas". Reach Kalpa for stunning close-up sunset views of Mount Kinner Kailash.',
    stay: 'Boutique Hotel in Kalpa',
    meals: 'Breakfast & Dinner'
  },
  {
    day: 9,
    title: 'Kalpa to Shimla travel via Rampur',
    desc: 'Scenic descent from the high snow desert back through lush Kinnaur pine forests. Stop at Rampur Bushahr royal palace. Reach the Queen of Hills, Shimla, for an evening stroll on the Mall Road.',
    stay: 'Heritage Stay in Shimla',
    meals: 'Breakfast & Dinner'
  },
  {
    day: 10,
    title: 'The Journey concludes upon arrival at Chandigarh',
    desc: 'Relish a hearty mountain breakfast before the final descent to Chandigarh. Drop off at Chandigarh Airport / Railway Station by 3:00 PM with heartfelt memories and lifelong friendships.',
    stay: 'Tour Concludes',
    meals: 'Breakfast'
  }
];

const FAQS_LIST = [
  {
    q: 'Is this trip suitable for first time Himalayan travelers?',
    a: 'Yes, absolutely! The route has been curated with a gradual, staged altitude acclimatization schedule (Narkanda -> Sangla -> Kalpa -> Kaza). Our team provides 24x7 medical support, pulse oximeters, and portable oxygen cylinders.'
  },
  {
    q: 'Is this trip suitable for everyone?',
    a: 'Winter Spiti is suited for travelers with reasonable physical fitness. Temperatures can drop between -10°C to -25°C at night. It is not recommended for infants or individuals with severe respiratory conditions.'
  },
  {
    q: 'How cold does it get in Spiti during winter?',
    a: 'Daytime temperatures range between -5°C to 5°C with bright sunshine. Night temperatures drop between -15°C to -25°C. All our accommodations provide traditional wood/electric Bukharis, thermal blankets, and hot water.'
  },
  {
    q: 'Is electricity and hot water available in winter?',
    a: 'Yes, properties in Kaza operate on solar power and generator backup. Hot water for morning use is provided in buckets heated traditionally over wood fires.'
  },
  {
    q: 'What if I get sick or fall unwell?',
    a: 'Our expedition leads carry comprehensive mountain first aid kits, Diamox for altitude sickness, and oxygen cylinders. Kaza has a Community Health Centre equipped with doctors and emergency oxygen.'
  },
  {
    q: 'Can I visit Chandratal Lake in winter?',
    a: 'Chandratal Lake is inaccessible during winter due to 15+ feet of snow blocking Kunzum Pass. This winter itinerary instead focuses on the spectacular frozen valleys of Kaza, Key, Langza, and Chicham.'
  },
  {
    q: 'What if roads get blocked due to heavy snowfall?',
    a: 'Our drivers are seasoned mountain specialists with 4x4 vehicles equipped with snow chains. We maintain dynamic buffer hours in the itinerary to ensure total safety.'
  },
  {
    q: 'What kind of vehicles are used?',
    a: 'Heated Force Tempo Travelers and 4x4 Mahindra Scorpios/Boleros with snow chains and high ground clearance.'
  },
  {
    q: 'Who should avoid this trip?',
    a: 'Those with severe cardiac or respiratory ailments, pregnant women, or travelers who cannot handle freezing temperatures should consider our summer Spiti expeditions instead.'
  },
  {
    q: 'Is internet and mobile connectivity available?',
    a: 'Jio and Airtel postpaid SIM cards provide 4G internet in Kalpa, Nako, and Kaza town. Remote passes may have intermittent connectivity.'
  }
];

const QUICK_INFO_ITEMS = [
  {
    id: 'packing',
    title: 'Packing List',
    iconType: 'luggage',
    points: [
      'Heavy feather down jacket rated for -20°C with windproof outer shell',
      'Thermal innerwear (minimum 3 sets - merino wool or synthetic fleece)',
      'High-ankle waterproof trekking snow boots with deep rubber lugs',
      'Fleece-lined waterproof snow gloves & inner woolen liner gloves',
      'Woolen beanies, thermal balaclava / monkey cap, and polar neck warmers',
      'UV 400 polarized sunglasses (essential to prevent snow blindness)',
      'Insulated 1L thermos vacuum flask for warm drinking water on drives',
      'High SPF 50+ sunscreen, cold cream, and medicated lip balm'
    ]
  },
  {
    id: 'good-to-fight',
    title: 'Good to Fight',
    iconType: 'shield',
    points: [
      'Spiti winter temperatures routinely plunge between -15°C to -30°C',
      'Follow the 3-layer rule: Moisture-wicking base layer + fleece mid layer + down outer jacket',
      'Sip lukewarm water frequently (3-4 litres/day) to stay properly hydrated in dry thin air',
      'Strictly avoid alcohol or smoking at high altitude as it accelerates hypoxia and dehydration',
      'Keep mobile phones and camera batteries tucked inside wool socks near your body heat'
    ]
  },
  {
    id: 'know-before-you-go',
    title: 'Know Before You Go',
    iconType: 'info',
    points: [
      'In sub-zero winter temperatures, pipeline water freezes; homestays use traditional eco dry composting toilets',
      'Warm water is provided in heated buckets morning and evening for freshening up',
      'Altitude acclimatization is built into the itinerary with gradual ascent via Kinnaur',
      'Only BSNL postpaid and Airtel postpaid provide intermittent reception in Kaza town',
      'Carry adequate cash from Chandigarh/Shimla as remote high-altitude ATMs often freeze'
    ]
  },
  {
    id: 'payment-policy',
    title: 'Payment Policy',
    iconType: 'card',
    points: [
      '25% token advance at time of booking to reserve your confirmed slot',
      '50% second milestone payment 30 days prior to departure date',
      'Remaining 25% balance payment 15 days before departure',
      'Flexible 0% No-Cost EMI payment plans available across leading bank cards (3, 6, 9 months)'
    ]
  },
  {
    id: 'terms-and-conditions',
    title: 'Terms and Conditions',
    iconType: 'terms',
    points: [
      'Valid Government ID proof (Aadhaar / Passport / Voter ID) is mandatory for permits and check-in',
      'Winter mountain itineraries are strictly subject to weather conditions, snowfall, and BRO road clearance',
      'The expedition captain reserves the right to alter route or timings for group safety',
      'Participants must adhere to the high-altitude safety guidelines and code of conduct'
    ]
  },
  {
    id: 'cancellation-policy',
    title: 'Cancellation and Refund Policy',
    iconType: 'refund',
    points: [
      '30+ days prior to departure: 90% refund or 100% lifetime travel credit shell',
      '15 to 29 days prior to departure: 50% refund',
      'Less than 15 days prior to departure: No cash refund (subject to third-party hotel lock-ins)',
      'In event of trip cancellation by organizers due to extreme weather or road closures: 100% credit shell issued'
    ]
  }
];

const renderQuickInfoIcon = (type) => {
  switch (type) {
    case 'luggage':
      return (
        <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'shield':
      return (
        <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'info':
      return (
        <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'card':
      return (
        <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case 'terms':
      return (
        <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'refund':
      return (
        <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    default:
      return null;
  }
};

export default function CreatorTripPage() {
  const pagesCms = useCmsData('pages');
  const footerCms = useCmsData('footer');
  const creatorCms = pagesCms?.creatorPage || {};
  const creatorName = creatorCms.creatorName || 'Ananya Sharma';
  const whatsappClean = (footerCms?.contactCta?.whatsapp || '+919548436762').replace(/[^0-9]/g, '');

  const [activeTab, setActiveTab] = useState('about');
  const [expandedDay, setExpandedDay] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [openQuickInfo, setOpenQuickInfo] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [activeModalImg, setActiveModalImg] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    travelDate: '',
    adults: '',
    children: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {}
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      alert('Please enter your name and mobile number.');
      return;
    }

    // Post to backend
    fetch(`${API_BASE}/enquiry.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.mobile,
        email: formData.email,
        date: formData.travelDate,
        travelers: formData.visitors,
        message: formData.message,
        destination: 'Spiti in Winter with Ananya Sharma'
      })
    }).catch(() => {});

    setFormSubmitted(true);
  };

  const toggleExpandAll = () => {
    setAllExpanded(!allExpanded);
    setExpandedDay(null);
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    const elem = document.getElementById(id);
    if (elem) {
      const offset = 120;
      const pos = elem.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-20 animate-fadeIn font-productsans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* Top Breadcrumb & Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              <span>{creatorCms.heroSubtitle || `Travel like ${creatorName}`}</span>
              <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
              <span className="text-gray-400">↗</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-950 font-sans tracking-tight">
              {creatorCms.heroTitle || 'Experience Spiti Valley in Winter'}
            </h1>
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-700 transition cursor-pointer"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{copiedShare ? 'Link Copied!' : '< Share'}</span>
          </button>
        </div>

        {/* 5-Photo Mosaic Grid (India Tour Experiences exact style) */}
        <div className="creator-mosaic-grid relative mb-8">
          {/* Main Hero Photo (Spans 2 cols & 2 rows) */}
          <div 
            onClick={() => { setActiveModalImg(0); setShowGalleryModal(true); }}
            className="creator-mosaic-hero relative cursor-pointer group overflow-hidden"
          >
            <LazyImage
              src={CREATOR_PHOTOS[0].url}
              alt={CREATOR_PHOTOS[0].title}
              eager
              fetchPriority="high"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></span>
          </div>

          {/* Photo 2 (Top middle) */}
          <div 
            onClick={() => { setActiveModalImg(1); setShowGalleryModal(true); }}
            className="hidden sm:block relative cursor-pointer group overflow-hidden"
          >
            <LazyImage
              src={CREATOR_PHOTOS[1].url}
              alt={CREATOR_PHOTOS[1].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></span>
          </div>

          {/* Photo 3 (Top right) */}
          <div 
            onClick={() => { setActiveModalImg(2); setShowGalleryModal(true); }}
            className="hidden sm:block relative cursor-pointer group overflow-hidden"
          >
            <LazyImage
              src={CREATOR_PHOTOS[2].url}
              alt={CREATOR_PHOTOS[2].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></span>
          </div>

          {/* Photo 4 (Bottom middle) */}
          <div 
            onClick={() => { setActiveModalImg(3); setShowGalleryModal(true); }}
            className="hidden sm:block relative cursor-pointer group overflow-hidden"
          >
            <LazyImage
              src={CREATOR_PHOTOS[3].url}
              alt={CREATOR_PHOTOS[3].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></span>
          </div>

          {/* Photo 5 (Bottom right with View Gallery button) */}
          <div 
            onClick={() => { setActiveModalImg(4); setShowGalleryModal(true); }}
            className="hidden sm:block relative cursor-pointer group overflow-hidden"
          >
            <LazyImage
              src={CREATOR_PHOTOS[4].url}
              alt={CREATOR_PHOTOS[4].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></span>

            {/* View Gallery Button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveModalImg(0); setShowGalleryModal(true); }}
              className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-gray-900 border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition flex items-center gap-1.5 cursor-pointer z-10"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>View Gallery</span>
            </button>
          </div>
        </div>

        {/* Two-Column Responsive Layout: Left 65% & Right 35% Sticky Form */}
        <div className="creator-layout-container">
          
          {/* LEFT COLUMN */}
          <div className="creator-content-col">
            
            {/* Creator Profile Box */}
            <div className="flex flex-col md:gap-3 pb-6">
              <div className="md:block hidden text-lg text-gray-700 font-normal">
                Itinerary curated for
              </div>
              <div className="flex justify-between items-end">
                <div className="flex space-x-4 sm:space-x-5 items-center">
                  <LazyImage
                    src="/creator-profile.jpg"
                    fallbackSrc="/hero-buddha.jpg"
                    alt="Ananya Sharma"
                    className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col gap-1">
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm md:hidden block whitespace-nowrap mb-0.5">
                        Itinerary curated for
                      </p>
                      <div className="flex items-center gap-1.5">
                        <h1 className="text-lg sm:text-xl md:text-2xl productSansBold text-gray-950 font-bold -mt-0.5">
                          Ananya Sharma
                        </h1>
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="#1da1f2" />
                          <path d="M8.5 12.2l2.3 2.3 4.7-4.8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm -mt-0.5">@ananyasharma</p>
                    </div>
                    <p className="text-gray-600 hidden md:block text-sm">
                      Traveller | Storyteller
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex whitespace-nowrap items-center gap-1 text-xs md:text-sm text-gray-700 font-normal border border-gray-300 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 transition cursor-pointer"
                >
                  <span className="text-sm">↗</span>
                  <span>Visit Profile</span>
                </button>
              </div>
            </div>

            <hr className="border-gray-200 border-b-[1px] my-1" />

            {/* Quick Facts Strip (Duration, Location, Stay, Meals) */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-6 py-4">
              <div className="flex space-x-3 items-start">
                <svg className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">Duration</p>
                  <h2 className="productSansBold text-base sm:text-lg md:text-xl font-bold text-gray-950 mt-0.5">
                    10 Days 9 Nights
                  </h2>
                </div>
              </div>

              <div className="flex space-x-3 items-start">
                <svg className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">Location</p>
                  <h2 className="productSansBold text-base sm:text-lg md:text-xl font-bold text-gray-950 mt-0.5">
                    Himachal Pradesh, India
                  </h2>
                </div>
              </div>

              <div className="flex space-x-3 items-start">
                <svg className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">Stay Category</p>
                  <h2 className="productSansBold text-base sm:text-lg md:text-xl font-bold text-gray-950 mt-0.5">
                    Standard/Premium
                  </h2>
                </div>
              </div>

              <div className="flex space-x-3 items-start">
                <svg className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">Meals</p>
                  <h2 className="productSansBold text-base sm:text-lg md:text-xl font-bold text-gray-950 mt-0.5">
                    Breakfast + Dinner
                  </h2>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 border-b-[1px] my-1" />

            {/* Tab Navigation Pill Bar */}
            <div className="flex items-center gap-2 sm:gap-2.5 py-2.5">
              {[
                { id: 'about', label: 'About' },
                { id: 'highlights', label: 'Highlights' },
                { id: 'itinerary', label: 'Itinerary' },
                { id: 'inclusions', label: 'Inclusion' },
                { id: 'exclusions', label: 'Exclusion' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className="px-4 py-1.5 rounded-lg text-xs sm:text-sm transition cursor-pointer whitespace-nowrap border border-gray-300 text-gray-800 hover:bg-gray-50 font-normal flex-shrink-0"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <hr className="border-gray-200 border-b-[1px] my-1" />

            {/* SECTION: About this Itinerary */}
            <div id="about" className="space-y-3 pt-2 scroll-mt-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-950 productSansBold">
                {creatorCms.aboutTitle || 'About this Itinerary'}
              </h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed font-normal">
                {creatorCms.aboutText || "Welcome to an exclusive winter journey through Spiti Valley, inspired by Ananya Sharma's unforgettable Himalayan adventure. After capturing the hearts of travelers with her winter escape to Kashmir, Ananya set her sights on something even more raw, remote, and transformative — Spiti in winter. Braving frozen roads, sub-zero temperatures, and untouched trails, she experienced a side of the Himalayas few dare to explore."}
              </p>
              <button
                type="button"
                onClick={() => setShowAboutModal(true)}
                className="text-gray-500 hover:text-gray-950 text-sm font-medium hover:underline cursor-pointer"
              >
                Read More...
              </button>
            </div>

            {/* SECTION: Highlights Slider / Grid */}
            <div id="highlights" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-gray-950 font-sans">Highlights</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {HIGHLIGHT_CARDS.map((card, i) => (
                  <div key={i} className="lazy-card-item group rounded-xl overflow-hidden border border-gray-100 shadow-2xs bg-white">
                    <div className="h-28 overflow-hidden">
                      <LazyImage
                        src={card.img}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{card.title}</h4>
                      <p className="text-[10px] text-gray-500 truncate">{card.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION: Day-by-Day Itinerary Accordion */}
            <div id="itinerary" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-950 font-sans">Itinerary</h2>
                <button
                  type="button"
                  onClick={toggleExpandAll}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-950 border border-gray-200 px-3 py-1 rounded-md transition cursor-pointer"
                >
                  {allExpanded ? 'Collapse All' : 'Expand All'}
                </button>
              </div>

              <div className="space-y-2.5">
                {ITINERARY_DAYS.map((item) => {
                  const isOpen = allExpanded || expandedDay === item.day;
                  return (
                    <div
                      key={item.day}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs transition"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedDay(isOpen && !allExpanded ? null : item.day)}
                        className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50/70 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-red-50 text-[#ec1d24] text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {item.day}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">
                            Day {item.day} - {item.title}
                          </span>
                        </div>
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-gray-600 border-t border-gray-100 bg-gray-50/40 space-y-2.5">
                          <p className="leading-relaxed">{item.desc}</p>
                          <div className="flex flex-wrap gap-4 pt-1 text-xs">
                            <span className="font-medium text-gray-700">🏨 Stay: <strong className="text-gray-900">{item.stay}</strong></span>
                            <span className="font-medium text-gray-700">🍽️ Meals: <strong className="text-gray-900">{item.meals}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION: Inclusions & Exclusions */}
            <div id="inclusions" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 scroll-mt-24">
              {/* Inclusion */}
              <div>
                <h3 className="font-bold text-gray-950 text-base mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">✓</span>
                  Inclusion
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Accommodation in standard/deluxe hotels & heated homestays</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Sanitized private 4x4 / Tempo Traveler with snow chains</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>All sightseeing and inner line permits as per itinerary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Chandigarh Airport / Railway Station pickup and drop</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Daily Breakfast and Dinner at all accommodations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>All toll taxes, parking fees, driver allowance, state permits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Oxygen cylinder, medical kits and 24x7 support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Experienced mountain tour captain and Ananya Sharma presence</span>
                  </li>
                </ul>
              </div>

              {/* Exclusion */}
              <div id="exclusions" className="scroll-mt-24">
                <h3 className="font-bold text-gray-950 text-base mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-bold">✕</span>
                  Exclusion
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Flight tickets or train tickets to/from Chandigarh</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Any personal adventure activities (skiing, snowmobiling)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Lunch and any personal extra food/beverages ordered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Costs incurred due to unforeseen roadblocks, landslides or natural calamities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Personal travel insurance (recommended)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* SECTION: Quick Info Accordions (India Tour Experiences exact style) */}
            <div id="quick-info" className="space-y-3 pt-6 border-t border-gray-100 scroll-mt-24">
              <h3 className="text-base font-bold text-gray-950">Quick Info</h3>
              <div className="quick-info-grid">
                {QUICK_INFO_ITEMS.map((item) => {
                  const isOpen = openQuickInfo === item.id;
                  return (
                    <div key={item.id} className="quick-info-card">
                      <button
                        type="button"
                        onClick={() => setOpenQuickInfo(isOpen ? null : item.id)}
                        className="quick-info-btn"
                        aria-expanded={isOpen}
                      >
                        <div className="quick-info-title-wrap">
                          {renderQuickInfoIcon(item.iconType)}
                          <span className="quick-info-title">{item.title}</span>
                        </div>
                        <svg
                          className={`w-3.5 h-3.5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-gray-900' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="quick-info-body">
                          <ul className="space-y-2">
                            {item.points.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <span className="text-red-500 font-bold text-xs mt-0.5">•</span>
                                <span className="text-gray-700 leading-relaxed">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION: FAQs Accordion */}
            <div id="faqs" className="space-y-3 pt-6 border-t border-gray-100 scroll-mt-24">
              <h3 className="text-lg font-bold text-gray-950 text-center mb-4">FAQs</h3>
              <div className="space-y-2">
                {FAQS_LIST.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          {faq.q}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-gray-600 border-t border-gray-100 bg-gray-50/40 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN STICKY ENQUIRY CARD */}
          <div className="creator-sticky-col">
            <div className="creator-enquiry-card">
              
              <div>
                <h3 className="creator-enquiry-title">
                  {creatorCms.heroTitle || 'Spiti in Winter'}
                </h3>
                <div className="creator-enquiry-subtitle">
                  <span>Travel like <strong>{creatorName}</strong></span>
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#1da1f2" />
                    <path d="M8.5 12.2l2.3 2.3 4.7-4.8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              </div>

              {formSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-bold text-gray-900 text-base productSansBold">Enquiry Sent!</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Thank you! Our expedition coordinator will connect with you on WhatsApp shortly to confirm your slot.
                  </p>
                  <a
                    href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(`Hello, I am interested in the ${creatorCms.heroTitle || 'Spiti in Winter'} trip with ${creatorName}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition"
                  >
                    Chat on WhatsApp Now
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3 flex flex-col">
                  <div>
                    <input
                      type="text"
                      required
                      name="name"
                      placeholder="Name*"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="creator-enquiry-input"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      name="mobile"
                      placeholder="Mobile No.*"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="creator-enquiry-input"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="creator-enquiry-input"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={formData.travelDate ? "date" : "text"}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                      name="travelDate"
                      placeholder="dd-mm-yyyy"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="creator-enquiry-input pr-10"
                    />
                    {!formData.travelDate && (
                      <svg
                        className="w-4 h-4 text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    )}
                  </div>

                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      name="adults"
                      placeholder="No of Adults*"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                      className="creator-enquiry-input flex-1"
                    />
                    <input
                      type="text"
                      name="children"
                      placeholder="Child"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                      className="creator-enquiry-input flex-1"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="creator-enquiry-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    className="creator-enquiry-btn"
                  >
                    Send Enquiry
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* About this Itinerary Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setShowAboutModal(false)} />
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative z-10 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xl font-bold text-gray-950 productSansBold">About this Itinerary</h3>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
              {creatorCms.aboutText ? (
                creatorCms.aboutText.split('\n').filter((p) => p.trim() !== '').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))
              ) : (
                <>
                  <p>
                    Welcome to an exclusive winter journey through Spiti Valley, inspired by {creatorName}'s unforgettable Himalayan adventure.
                  </p>
                  <p>
                    After capturing the hearts of travelers with her winter escape to Kashmir, {creatorName} set her sights on something even more raw, remote, and transformative — Spiti in winter. Braving frozen roads, sub-zero temperatures, and untouched trails, she experienced a side of the Himalayas few dare to explore.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          <div className="flex items-center justify-between text-white">
            <h3 className="font-bold text-sm sm:text-base">
              {CREATOR_PHOTOS[activeModalImg].title} ({activeModalImg + 1}/{CREATOR_PHOTOS.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowGalleryModal(false)}
              className="text-white hover:text-gray-300 text-2xl font-bold p-2 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative my-4">
            <img
              src={CREATOR_PHOTOS[activeModalImg].url}
              alt={CREATOR_PHOTOS[activeModalImg].title}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Prev / Next buttons */}
            <button
              type="button"
              onClick={() => setActiveModalImg((prev) => (prev === 0 ? CREATOR_PHOTOS.length - 1 : prev - 1))}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-lg cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActiveModalImg((prev) => (prev === CREATOR_PHOTOS.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-lg cursor-pointer"
            >
              ›
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {CREATOR_PHOTOS.map((p, i) => (
              <img
                key={i}
                src={p.url}
                alt={p.title}
                loading="lazy"
                decoding="async"
                onClick={() => setActiveModalImg(i)}
                className={`w-14 h-10 sm:w-20 sm:h-14 object-cover rounded-md cursor-pointer transition ${
                  i === activeModalImg ? 'ring-2 ring-white scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
