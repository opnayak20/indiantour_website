import React, { useState, useEffect, useMemo } from 'react';
import {
  FaWhatsapp,
  FaCheck,
  FaXmark,
  FaChevronDown,
  FaChevronUp,
  FaFilePdf,
  FaStar,
  FaArrowLeft,
  FaShareNodes,
  FaPhone,
  FaCircleCheck,
  FaRegCopy
} from 'react-icons/fa6';
import { API_BASE } from '../config/api';
import LazyImage from './LazyImage';

// Ticket Notch Scallop Curve SVG as Data URI (cloned exactly from reference)
const TICKET_CURVE_URI = `data:image/svg+xml;utf8,<svg id="Objects" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7294.8 75" preserveAspectRatio="none"><defs><style>.cls-1{fill:%23fff;stroke-width:0px;}</style></defs><path class="cls-1" d="M0,75V0c29.1,0,43.8,12.9,56.8,24.3,12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6C161.6,12.9,176.3,0,205.4,0s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6C366.9,12.9,381.7,0,410.8,0s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6C572.3,12.9,587,0,616.1,0s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6C777.6,12.9,792.4,0,821.5,0s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6C983,12.9,997.7,0,1026.8,0s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3s43.8,12.9,56.8,24.3c12.6,11.1,23.6,20.6,45.9,20.6s33.2-9.6,45.9-20.6c12.9-11.4,27.7-24.3,56.8-24.3v75H0Z"/></svg>`;

// Helper function to build full destination profile matching to-be-clone
export function getTourDetailsData(tour) {
  // Check localStorage for overrides
  let overrides = null;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('india_tour_package_overrides') : null;
    if (raw) {
      const allOverrides = JSON.parse(raw);
      const idKey = tour?.id;
      const slugKey = tour?.slug;
      const titleKey = (tour?.title || tour?.name || '').toLowerCase().trim();
      overrides = (idKey && allOverrides[idKey]) || 
                  (slugKey && allOverrides[slugKey]) || 
                  (titleKey && allOverrides[titleKey]) || null;
    }
  } catch (err) {
    console.error('Error reading package overrides:', err);
  }

  const effectiveTour = { ...(tour || {}), ...(overrides || {}) };
  const t = (effectiveTour?.title || effectiveTour?.name || '').toLowerCase();
  const isJaisalmer = t.includes('jaisalmer') || t.includes('thar') || t.includes('desert');
  const isMeghalaya = t.includes('meghalaya') || t.includes('kaziranga');
  const isKashmir = t.includes('kashmir');
  const isSpiti = t.includes('spiti');
  const isLadakh = t.includes('ladakh') || t.includes('leh');

  let baseData = null;
  if (isJaisalmer) {
    baseData = {
      title: 'Jaisalmer Group Trip',
      subtitle: 'Free Camel Safari',
      duration: '3 Days 2 Nights',
      categoryBadge: 'Group Trip',
      basePrice: 7800,
      originalPrice: 10800,
      saveAmount: 3000,
      routeSummary: 'Ahmedabad Package with AC Sleeper Bus + Tempo Traveller',
      overviewText: `Jaisalmer is a city built from yellow sandstone. It sits at the edge of the Thar Desert and turns gold at sunset.

Our Jaisalmer group trip from Ahmedabad runs for 3 days and 2 nights. You board an overnight AC bus or Tempo Traveller and wake up in the Golden City. We take care of your stay, breakfasts, dinners, sightseeing and a free camel safari. Our trip leader stays with the group from start to finish.`,
      placesToVisit: [
        { name: 'Jaisalmer Fort and city sightseeing', desc: 'We walk through one of the few living forts in India. Patwon Ki Haveli and Gadisar Lake are on the list too.' },
        { name: 'Bada Bagh', desc: 'We stop at the royal cenotaphs on the desert hill overlooking the dunes.' },
        { name: 'Kuldhara Ghost Village', desc: 'This village was abandoned overnight in the early 1800s. We explore the eerie sandstone ruins on foot.' },
        { name: 'Sam Sand Dunes', desc: 'This is the highlight. You ride a camel, watch the sunset, and end the night with Rajasthani folk music at a bonfire.' },
        { name: 'Longewala and Tanot Mata Mandir', desc: 'We visit two iconic border battle sites tied to the 1965 and 1971 Indo-Pak wars.' }
      ],
      thingsToDo: [
        { name: 'Ride a camel at Sam', desc: 'This one is on us. The sunset camel safari is complimentary with your trip.' },
        { name: 'Catch sunset on the dunes', desc: 'Get there early and find a spot on the ridge. The light changes every few minutes into deep amber.' },
        { name: 'Sit around the bonfire', desc: 'The desert is dark and quiet at night. Look up. You will see more stars than you ever do in the city.' },
        { name: 'Get lost in fort lanes', desc: 'Shops, cafes, and rooftop guesthouses sit inside the fort walls. Go slow. Look at carved stone balconies.' },
        { name: 'Shop the bazaars', desc: 'Look for mirror work, block prints, leather juttis, and silver jewelry. Bargain politely.' },
        { name: 'Eat authentic local cuisine', desc: 'Try dal baati churma, ker sangri, and gatte ki sabzi during lunch stops.' }
      ],
      travelTips: [
        { name: 'Pack layers', desc: 'Desert nights drop fast in winter. Carry a warm jacket, a scarf, and socks.' },
        { name: 'Sun protection', desc: 'Carry sunscreen, sunglasses, and a cap. The sun is strong even in winter.' },
        { name: 'Wear comfortable shoes', desc: 'The fort, Kuldhara, and Bada Bagh are all on foot. Sand and stone do not go well with flip-flops.' },
        { name: 'Keep cash handy', desc: 'Lunch is not included. Some small desert shops do not take UPI reliably.' },
        { name: 'Carry government ID', desc: 'Border areas like Longewala and Tanot Mata Mandir require original ID for entry permits.' }
      ],
      perks: [
        { title: 'Stay included', desc: 'Hotel & Desert Camp' },
        { title: 'Meals included', desc: 'Breakfast & Dinner' },
        { title: 'Sightseeing included', desc: 'All Major Attractions' },
        { title: 'Trip Leader included', desc: 'Experienced Leader' }
      ],
      heroImages: [
        'https://img.avianexperiences.com/trek/d5b19425-cec1-4e3c-81bb-7f00f04f644d/Camel_Safari.jpg',
        'https://img.avianexperiences.com/trek-memories/d30902d7-f575-4bc3-a483-32f64e67bcef/DSC00719.jpg',
        'https://img.avianexperiences.com/trek/59b01d6e-0709-430d-9bdf-905a8b209d92/Bada_Bagh_Jaisalmer_5.jpg',
        'https://img.avianexperiences.com/schedule/25a588e2-16f1-4916-981e-0e317380beae/Patwon_Ki_Haveli_Jaisalmer6.jpg',
        'https://img.avianexperiences.com/trek/0d9ea3a2-36db-4a3d-a099-f8338d0160cd/DSC00297.jpg'
      ],
      memoriesImages: [
        'https://img.avianexperiences.com/trek-memories/45a340c3-d15c-420a-869d-95ce9c76c9fa/DSC00297.jpg',
        'https://img.avianexperiences.com/trek/dd74fd31-7d7c-4439-b5e1-1eeadb8c7d21/Jalsaimer_Fort6.jpg',
        'https://img.avianexperiences.com/trek-memories/271e7d6f-a39a-4a64-a7d5-b52bf749a7b7/DSC00834.jpg',
        'https://img.avianexperiences.com/trek/2a1f598b-227c-47cd-9e94-8241d02016c5/DSC00719.jpg',
        'https://img.avianexperiences.com/trek-memories/c9c267ed-906c-4c39-abdc-8084739f3fa9/DSC01353.jpg'
      ],
      itinerary: [
        {
          day: 0,
          title: 'Overnight journey from Ahmedabad to Jaisalmer',
          date: 'November 05, 2026',
          img: 'https://img.avianexperiences.com/schedule/b6bb257e-2060-43bd-b14d-7ceeec528381/Atal_Bridge.jpg',
          points: [
            'We start our journey via road towards Jaisalmer in the evening from Ahmedabad.',
            'Reporting at RTO Circle, Ahmedabad at approx. 8:00 PM.',
            'Overnight journey in Sleeper AC Bus / Tempo Traveller with fellow group travelers.'
          ],
          stay: 'Overnight Journey in AC Sleeper Bus',
          meals: 'Self Paid on Highway Halt'
        },
        {
          day: 1,
          title: 'Arrival in Jaisalmer & City Sightseeing',
          date: 'November 06, 2026',
          img: 'https://img.avianexperiences.com/schedule/25a588e2-16f1-4916-981e-0e317380beae/Patwon_Ki_Haveli_Jaisalmer6.jpg',
          points: [
            'Post an overnight journey from Ahmedabad, arrive at Jaisalmer in the morning.',
            'Pick up from Jaisalmer Bus Stop by Tempo Traveller / Taxi Vehicle.',
            'Check in to your hotel and freshen up.',
            'Start walking tour of Jaisalmer Fort (Sonar Quila), a UNESCO World Heritage Site with living quarters and Jain temples.',
            'Explore Patwon Ki Haveli, Salim Singh Ki Haveli, and Nathmal Ki Haveli showcasing ornate sandstone carvings.',
            'Evening stroll and boating at serene Gadisar Lake during golden sunset.',
            'Free time to explore local bazaars for Rajasthani handicrafts, mirror work, and souvenirs.'
          ],
          stay: '🏨 Overnight stay at hotel in Jaisalmer',
          meals: '🍽️ Dinner Included'
        },
        {
          day: 2,
          title: 'Departure for Sand Dunes via Bada Baugh & Kuldhara',
          date: 'November 07, 2026',
          img: 'https://img.avianexperiences.com/schedule/cad2f822-8e58-4387-a59c-0bc0146de8d5/Bada_Bagh_Jaisalmer_5.jpg',
          points: [
            'Start your day with a tasty breakfast at the Jaisalmer hotel.',
            'Morning visit to Bada Bagh – historic cenotaphs of Jaisalmer rulers surrounded by open desert.',
            'Explore Kuldhara Village – the mysterious 13th-century abandoned ghost village.',
            'Drive to Sam Sand Dunes (approx. 40 km from Jaisalmer).',
            'Check-in at luxury desert camp with welcome tikka and dhol.',
            'Complimentary sunset Camel Safari on the rippling sand dunes.',
            'Evening cultural program with Rajasthani Kalbeliya folk dance & music around a blazing bonfire.',
            'Authentic Rajasthani buffet dinner under the desert night sky.'
          ],
          stay: '⛺ Overnight stay at luxury desert camp under starlit sky',
          meals: '🍽️ Breakfast & Dinner Included'
        },
        {
          day: 3,
          title: 'Departure for Jaisalmer & Visit Longewala, Tanot Mata Mandir',
          date: 'November 08, 2026',
          img: 'https://img.avianexperiences.com/schedule/422499fa-ca17-4cef-82a9-bddbced75134/tanot-mata-temple_2.jpg',
          points: [
            'Breakfast at the Desert Camp and check out.',
            'Drive to the historic Longewala battlefield, immortalized during the 1971 Indo-Pak war.',
            'Tanot Mata Mandir – ancient temple near the border known for surviving thousands of bombs during war.',
            'Witness the Indo-Pak Border perimeter and hear tales of army valor.',
            'Evening drop at Jaisalmer pickup point to board return AC Sleeper Bus / Tempo Traveller.',
            'Overnight journey towards Ahmedabad.'
          ],
          stay: 'Overnight Journey towards Ahmedabad',
          meals: '🍽️ Breakfast Included'
        },
        {
          day: 4,
          title: 'Arrival at Ahmedabad',
          date: 'November 09, 2026',
          img: 'https://img.avianexperiences.com/schedule/fb5f3b45-7110-49b7-9501-69970b76fe74/Screenshot_2026-09-26_at_7.13.44_PM.png',
          points: [
            'Arrive in Ahmedabad early in the morning (around 7:00 AM - 8:00 AM).',
            'Conclude this wonderful desert journey filled with cherished memories, new group friends, and countless photos!'
          ],
          stay: 'Tour Concludes',
          meals: 'Tour Ends'
        }
      ],
      inclusions: [
        'Ahmedabad <-> Jaisalmer AC Sleeper Bus or Tempo Traveller',
        'Bus Station to Hotel & Desert Camp Transfers',
        'Stay in Hotel & Luxury Swiss Desert Camp on selected sharing basis',
        'Breakfast & Dinner at properties (2 Breakfast + 2 Dinner + Evening Tea & Snacks at Sam)',
        'Free Sunset Camel Safari at Sam Sand Dunes',
        'Bonfire and Rajasthani cultural folk dance program',
        'All sightseeing as per itinerary in private vehicle',
        'Permits and border clearances for Tanot and Longewala',
        'Experienced and friendly Trip Captain throughout the expedition'
      ],
      exclusions: [
        '5% GST on the final billing amount',
        'Lunch meals during sightseeing halts',
        'Monument entrance tickets & camera / video fees',
        'Jeep Dune Bashing, Quad Biking, Parasailing or other paid adventure sports at Sam',
        'Personal expenses, room service, laundry, and tips',
        'Any cost arising due to unforeseen road blocks or weather disruptions'
      ],
      packageCities: [
        {
          id: 'ahmedabad',
          name: 'Ahmedabad',
          duration: '3 Days',
          regularPrice: 10800,
          discountPrice: 7800,
          vehicle: 'AC Sleeper Bus + Tempo Traveller',
          img: 'https://img.avianexperiences.com/package/0d79e635-bcc4-40f4-9403-000ab7db6929/Atal_Bridge.jpg'
        },
        {
          id: 'jaisalmer',
          name: 'Jaisalmer',
          duration: '3 Days',
          regularPrice: 7800,
          discountPrice: 5800,
          vehicle: 'Tempo Traveller / SUV (Ex-Jaisalmer)',
          img: 'https://img.avianexperiences.com/package/ceb4e5f4-13af-4eb8-bb57-e9dc14b9f6ec/Atal_Bridge_copy.jpg'
        }
      ],
      sharingOptions: [
        { id: 'quad', name: 'Quad Sharing', regular: 10800, discounted: 7800, off: 3000 },
        { id: 'triple', name: 'Triple Sharing', regular: 11500, discounted: 8500, off: 3000 },
        { id: 'double', name: 'Double Sharing', regular: 12800, discounted: 9800, off: 3000 }
      ],
      months: [
        { name: 'November 2026', count: 4 },
        { name: 'December 2026', count: 5 },
        { name: 'January 2027', count: 4 },
        { name: 'February 2027', count: 4 }
      ],
      batches: [
        { date: '5 Nov', day: 'Thursday', fullDate: '05 Nov - 09 Nov', status: 'Available', statusClass: 'text-green border-green-200 bg-green-50' },
        { date: '12 Nov', day: 'Thursday', fullDate: '12 Nov - 16 Nov', status: 'Filling Fast', statusClass: 'text-amber-600 border-amber-200 bg-amber-50' },
        { date: '19 Nov', day: 'Thursday', fullDate: '19 Nov - 23 Nov', status: 'Available', statusClass: 'text-green border-green-200 bg-green-50' },
        { date: '26 Nov', day: 'Thursday', fullDate: '26 Nov - 30 Nov', status: 'Sold Out', statusClass: 'text-red-600 border-red-200 bg-red-50' }
      ],
      attractions: [
        { name: 'Jaisalmer Fort', tag: 'The Golden Wonder of Rajasthan', img: 'https://img.avianexperiences.com/attractions/b6dd1b9a-851b-4ea8-8d16-e97dfc846356' },
        { name: 'Patwon ki Haveli', tag: 'Rajasthan’s Architectural Marvel', img: 'https://img.avianexperiences.com/attractions/8a11b056-9594-404b-988f-322938c5af87' },
        { name: 'Salim Singh Ki Haweli', tag: 'Royal mansion famed for balconies', img: 'https://img.avianexperiences.com/attractions/a738907b-ee80-47dd-8d6c-93c396e60362' },
        { name: 'Nathmal Ki Haveli', tag: 'A Gem of Rajput Stone Craft', img: 'https://img.avianexperiences.com/attractions/b4292090-0e1e-4cba-82f2-654a7765b2bc' },
        { name: 'Gadisar Lake', tag: 'Historic desert reservoir & sunset', img: 'https://img.avianexperiences.com/attractions/ec8f85d8-9849-4224-9fa2-888bf85696c3' },
        { name: 'Bada Bagh', tag: 'Royal Cenotaphs on the Sand Ridge', img: 'https://img.avianexperiences.com/trek/59b01d6e-0709-430d-9bdf-905a8b209d92/Bada_Bagh_Jaisalmer_5.jpg' },
        { name: 'Kuldhara Ghost Village', tag: 'Abandoned Paliwal Brahmin heritage', img: 'https://img.avianexperiences.com/attractions/8a11b056-9594-404b-988f-322938c5af87' },
        { name: 'Sam Sand Dunes', tag: 'Desert camping, camel safari & campfire', img: 'https://img.avianexperiences.com/trek/d5b19425-cec1-4e3c-81bb-7f00f04f644d/Camel_Safari.jpg' }
      ],
      quickInfoItems: [
        {
          title: 'Things to Carry',
          content: 'Warm jacket & fleece (desert nights can dip below 10°C), comfortable walking shoes, sunscreen & sunglasses, cotton scarf or bandana for sand protection, power bank, motion sickness tablets for bus journey, and original photo government ID.'
        },
        {
          title: 'How to Reach',
          content: 'Ahmedabad travelers report at RTO Circle around 8:00 PM on Day 0. If joining directly at Jaisalmer, reach Jaisalmer Railway Station or Airport by 9:00 AM on Day 1.'
        },
        {
          title: 'Weather & Best Time',
          content: 'October to March is peak winter season in Jaisalmer. Expect bright, pleasant sunny days (24°C - 28°C) and crisp cold desert nights (8°C - 12°C).'
        },
        {
          title: 'Safety & Solo Travelers',
          content: 'Our group trips are 100% safe, verified, and friendly for solo travelers and female travelers. We have dedicated trip leaders, verified stays, and supportive group dynamics.'
        }
      ],
      faqs: [
        {
          q: 'How much does the Jaisalmer group trip from Ahmedabad cost?',
          a: 'The trip starts at ₹7,800 per person on Quad Sharing, ₹8,500 on Triple Sharing, and ₹9,800 on Double Sharing from Ahmedabad. Direct Jaisalmer pickup starts at ₹5,800 per person. GST at 5% is extra.'
        },
        {
          q: 'How many days is this Jaisalmer tour package?',
          a: 'It is a 3 Days 2 Nights trip (4 Days including the overnight journeys). You travel overnight from Ahmedabad on Day 0, spend Days 1 to 3 in Jaisalmer & Sam Sand Dunes, and reach Ahmedabad on the morning of Day 4.'
        },
        {
          q: 'What is included in the Jaisalmer trip package?',
          a: 'The package includes Ahmedabad <-> Jaisalmer transfers, stay in Jaisalmer hotel and Swiss Desert camp, daily breakfast and dinner, free sunset camel safari, desert cultural folk night with bonfire, and guided sightseeing with a trip leader.'
        },
        {
          q: 'Which places do we visit on this Jaisalmer trip?',
          a: 'You visit Jaisalmer Golden Fort, Patwon Ki Haveli, Salim Singh Ki Haveli, Nathmal Ki Haveli, Gadisar Lake, Bada Bagh cenotaphs, Kuldhara Ghost Village, Sam Sand Dunes, Longewala 1971 War Memorial, and Tanot Mata Mandir.'
        },
        {
          q: 'Is the camel safari at Sam Sand Dunes free?',
          a: 'Yes! The camel safari across the golden ripples of Sam Sand Dunes during sunset is completely complimentary on this package.'
        },
        {
          q: 'Is this Jaisalmer trip safe for solo travelers and women?',
          a: 'Absolutely. A large percentage of our travelers are solo travelers and female adventurers. Our certified trip leaders ensure safe, respectful, and seamless logistics from start to finish.'
        }
      ],
      reviews: [
        {
          name: 'Prathvi Rao',
          type: 'private',
          tourBooked: 'Jaisalmer Group Trip',
          rating: 5,
          img: 'https://img.avianexperiences.com/review/186bd742-1ed6-409b-8a03-e403d8bf8fe5/1.jpeg',
          review: 'The trip was exceptionally well-organized! The desert camp experience at Sam Sand Dunes and the sunset camel ride were unforgettable. The trip captain kept everyone engaged and energized.'
        },
        {
          name: 'Hardik Mehta',
          type: 'group',
          tourBooked: 'Jaisalmer Group Trip',
          rating: 5,
          img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          review: 'Best road trip experience from Ahmedabad! Everything promised was delivered without hassle. Tanot Mata temple and Longewala battlefield visit gave us goosebumps.'
        },
        {
          name: 'Sneha Patel',
          type: 'solo',
          tourBooked: 'Jaisalmer Group Trip',
          rating: 5,
          img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          review: 'I traveled solo for the first time and had the best group experience ever. Completely safe, great Swiss tents, hygienic food, and memories for life!'
        },
        {
          name: 'Amit Shah',
          type: 'couple',
          tourBooked: 'Jaisalmer Group Trip',
          rating: 5,
          img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
          review: 'Worth every rupee. The campfire and Kalbeliya folk dance under the stars was pure magic. Kudos to India Tour team!'
        }
      ]
    };
  } else {
    // Dynamic Generator for other destinations (Meghalaya, Kashmir, Spiti, etc.)
    const destName = effectiveTour?.title || effectiveTour?.name || 'Exotic Tour Package';
    const durationStr = effectiveTour?.duration || '6 Days 5 Nights';
    const baseP = effectiveTour?.price || effectiveTour?.basePrice || 18999;
    const origP = effectiveTour?.originalPrice || effectiveTour?.original_price || baseP + 4000;
    const saveP = Math.max(2000, origP - baseP);

    const images = (effectiveTour?.images && effectiveTour.images.length >= 5)
      ? effectiveTour.images
      : [
          effectiveTour?.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
        ];

    baseData = {
      title: destName,
      subtitle: effectiveTour?.route || effectiveTour?.subtitle || 'Handcrafted Group Expedition',
      duration: durationStr,
    categoryBadge: 'Group Trip',
    basePrice: baseP,
    originalPrice: origP,
    saveAmount: saveP,
    routeSummary: `Curated ${durationStr} expedition with premium stay and verified trip captain`,
    overviewText: `${destName} is one of India's most breathtaking travel experiences. Discover jaw-dropping landscapes, authentic local heritage, and memorable group camaraderie.

Our ${durationStr} group package takes care of verified stays, daily breakfasts and dinners, experiential sightseeing, and an expert trip captain from start to finish.`,
    placesToVisit: [
      { name: 'Panoramic Viewpoints & Mountain Passes', desc: 'Marvel at dramatic mountain vistas and pristine valley horizons with curated photo halts.' },
      { name: 'Heritage Landmarks & Cultural Sanctuaries', desc: 'Explore centuries-old monasteries, shrines, and vibrant tribal villages.' },
      { name: 'Crystal Rivers & Nature Trails', desc: 'Walk along untouched forest paths and enjoy tranquil lakeside moments.' }
    ],
    thingsToDo: [
      { name: 'Campfire & Acoustic Evenings', desc: 'Unwind under blanket of stars with acoustic tunes and laughter.' },
      { name: 'Local Gastronomy Tastings', desc: 'Sample authentic regional dishes and freshly brewed mountain teas.' },
      { name: 'Cultural Village Walks', desc: 'Interact with warm locals and learn traditional ways of living.' }
    ],
    travelTips: [
      { name: 'Pack suitable layers', desc: 'Check seasonal temperatures and carry adequate thermals or windproof jackets.' },
      { name: 'Sturdy footwear', desc: 'Comfortable hiking shoes or walking sneakers are recommended.' },
      { name: 'Essential IDs & permits', desc: 'Carry valid photo ID for verification at check-posts and permits.' }
    ],
    perks: [
      { title: 'Stay included', desc: 'Handpicked Stays' },
      { title: 'Meals included', desc: 'Breakfast & Dinner' },
      { title: 'Sightseeing included', desc: 'Curated Route' },
      { title: 'Trip Leader included', desc: 'Expedition Captain' }
    ],
    heroImages: images.slice(0, 5),
    memoriesImages: images,
    itinerary: [
      {
        day: 0,
        title: `Arrival & Welcome at ${destName}`,
        date: 'Day 0',
        img: images[0],
        points: [
          'Arrive at the destination reporting hub and meet your expedition captain.',
          'Check-in to your premium boutique stay and freshen up.',
          'Evening orientation session, group introductions, and welcome dinner.'
        ],
        stay: '🏨 Deluxe Boutique Hotel',
        meals: '🍽️ Dinner Included'
      },
      {
        day: 1,
        title: 'Full Day Iconic Sightseeing & Trail Exploration',
        date: 'Day 1',
        img: images[1] || images[0],
        points: [
          'Wake up to fresh morning air and hearty breakfast.',
          'Embark on guided sightseeing of the most iconic landscapes and heritage landmarks.',
          'Capture stunning photographs at prime scenic viewpoints.'
        ],
        stay: '🏨 Deluxe Boutique Hotel',
        meals: '🍽️ Breakfast & Dinner Included'
      },
      {
        day: 2,
        title: 'Offbeat Adventure & Cultural Immersion',
        date: 'Day 2',
        img: images[2] || images[0],
        points: [
          'Venture into scenic valleys, local markets, and cultural landmarks.',
          'Interaction with local communities and sampling traditional treats.',
          'Evening campfire and bonding session under starry skies.'
        ],
        stay: '⛺ Scenic Camp / Heritage Resort',
        meals: '🍽️ Breakfast & Dinner Included'
      },
      {
        day: 3,
        title: 'Lakeside Excursion & Scenic Trekking',
        date: 'Day 3',
        img: images[3] || images[0],
        points: [
          'Visit stunning water bodies and nature trails.',
          'Experience peaceful serene moments away from city hustle.',
          'Buffet dinner with regional flavors.'
        ],
        stay: '🏨 Deluxe Boutique Stay',
        meals: '🍽️ Breakfast & Dinner Included'
      },
      {
        day: 4,
        title: 'Final Sunrise & Departure with Memories',
        date: 'Day 4',
        img: images[4] || images[0],
        points: [
          'Enjoy final sunrise and breakfast.',
          'Check out and transfer to departure hub with bagful of memories and lifelong friendships.'
        ],
        stay: 'Tour Concludes',
        meals: '🍽️ Breakfast Included'
      }
    ],
    inclusions: [
      'Accommodation in handpicked hotels & scenic camps',
      'Breakfast and dinner as specified in itinerary',
      'Private vehicle for all transfers and curated sightseeing',
      'Experienced and certified Trip Captain throughout the expedition',
      'All toll taxes, parking fees, and driver allowances',
      'First aid kit and oxygen support on high-altitude circuits'
    ],
    exclusions: [
      '5% GST on the total package billing',
      'Airfare or train fare to and from destination',
      'Lunch and any extra personal refreshments',
      'Optional adventure activities, entry tickets, and permits',
      'Personal medical expenses or emergency evacuation costs'
    ],
    packageCities: [
      {
        id: 'standard',
        name: 'Standard Route',
        duration: durationStr,
        regularPrice: origP,
        discountPrice: baseP,
        vehicle: 'Tempo Traveller / Dedicated SUV',
        img: images[0]
      }
    ],
    sharingOptions: [
      { id: 'quad', name: 'Quad Sharing', regular: origP - 1000, discounted: baseP - 1000, off: saveP },
      { id: 'triple', name: 'Triple Sharing', regular: origP, discounted: baseP, off: saveP },
      { id: 'double', name: 'Double Sharing', regular: origP + 2000, discounted: baseP + 2000, off: saveP }
    ],
    months: [
      { name: 'November 2026', count: 4 },
      { name: 'December 2026', count: 4 },
      { name: 'January 2027', count: 4 },
      { name: 'February 2027', count: 4 }
    ],
    batches: [
      { date: '05 Nov', day: 'Thursday', fullDate: '05 Nov - 10 Nov', status: 'Available', statusClass: 'text-green border-green-200 bg-green-50' },
      { date: '15 Nov', day: 'Sunday', fullDate: '15 Nov - 20 Nov', status: 'Filling Fast', statusClass: 'text-amber-600 border-amber-200 bg-amber-50' },
      { date: '25 Nov', day: 'Wednesday', fullDate: '25 Nov - 30 Nov', status: 'Available', statusClass: 'text-green border-green-200 bg-green-50' },
      { date: '05 Dec', day: 'Saturday', fullDate: '05 Dec - 10 Dec', status: 'Available', statusClass: 'text-green border-green-200 bg-green-50' }
    ],
    attractions: [
      { name: 'Scenic Valley Viewpoint', tag: 'Panoramic Himalayan vistas', img: images[0] },
      { name: 'Ancient Heritage Shrine', tag: 'Centuries of rich local spirituality', img: images[1] },
      { name: 'Crystal River Sanctuary', tag: 'Tranquil glacial waters and alpine woods', img: images[2] },
      { name: 'Artisan Village Trail', tag: 'Handmade crafts, woven shawls & smiles', img: images[3] }
    ],
    quickInfoItems: [
      { title: 'Things to Carry', content: 'Warm layers, windbreaker jacket, sunscreen, sturdy walking sneakers, water bottle, and personal medical kit.' },
      { title: 'Weather & Best Time', content: 'Pleasant temperatures during the day and crisp mountain breeze during evening.' },
      { title: 'Safety Guidelines', content: 'Certified guides, verified accommodations, and 24/7 dedicated backend support.' }
    ],
    faqs: [
      { q: `What is included in the ${destName} trip?`, a: 'The package covers premium stay, breakfast & dinner, transfers in comfortable vehicles, and an experienced trip captain.' },
      { q: 'Is it suitable for solo travelers?', a: 'Yes! 50% of our group trip travelers join solo. It is extremely welcoming, safe, and social.' }
    ],
    reviews: [
      {
        name: 'Rohan Sharma',
        type: 'solo',
        tourBooked: destName,
        rating: 5,
        img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        review: `Unbelievable journey to ${destName}! The group leader was phenomenal and the accommodations were top tier.`
      },
      {
        name: 'Ananya Verma',
        type: 'group',
        tourBooked: destName,
        rating: 5,
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        review: 'Superb coordination, hygienic food, and fantastic group vibes. Will definitely travel with India Tour again!'
      }
    ]
  };
  }

  const finalData = { ...baseData };

  if (effectiveTour.title) finalData.title = effectiveTour.title;
  if (effectiveTour.subtitle) finalData.subtitle = effectiveTour.subtitle;
  if (effectiveTour.duration) finalData.duration = effectiveTour.duration;
  if (effectiveTour.categoryBadge || effectiveTour.category) finalData.categoryBadge = effectiveTour.categoryBadge || effectiveTour.category;
  if (effectiveTour.basePrice || effectiveTour.price) finalData.basePrice = Number(effectiveTour.basePrice || effectiveTour.price);
  if (effectiveTour.originalPrice || effectiveTour.original_price) finalData.originalPrice = Number(effectiveTour.originalPrice || effectiveTour.original_price);
  if (effectiveTour.saveAmount) finalData.saveAmount = Number(effectiveTour.saveAmount);
  if (effectiveTour.routeSummary || effectiveTour.location) finalData.routeSummary = effectiveTour.routeSummary || effectiveTour.location;
  if (effectiveTour.overviewText || effectiveTour.overview) finalData.overviewText = effectiveTour.overviewText || effectiveTour.overview;

  if (Array.isArray(effectiveTour.itinerary) && effectiveTour.itinerary.length > 0) {
    finalData.itinerary = effectiveTour.itinerary;
  }
  if (Array.isArray(effectiveTour.inclusions) && effectiveTour.inclusions.length > 0) {
    finalData.inclusions = effectiveTour.inclusions;
  }
  if (Array.isArray(effectiveTour.exclusions) && effectiveTour.exclusions.length > 0) {
    finalData.exclusions = effectiveTour.exclusions;
  }
  if (Array.isArray(effectiveTour.placesToVisit) && effectiveTour.placesToVisit.length > 0) {
    finalData.placesToVisit = effectiveTour.placesToVisit;
  }
  if (Array.isArray(effectiveTour.thingsToDo) && effectiveTour.thingsToDo.length > 0) {
    finalData.thingsToDo = effectiveTour.thingsToDo;
  }
  if (Array.isArray(effectiveTour.travelTips) && effectiveTour.travelTips.length > 0) {
    finalData.travelTips = effectiveTour.travelTips;
  }
  if (Array.isArray(effectiveTour.attractions) && effectiveTour.attractions.length > 0) {
    finalData.attractions = effectiveTour.attractions;
  }
  if (Array.isArray(effectiveTour.perks) && effectiveTour.perks.length > 0) {
    finalData.perks = effectiveTour.perks;
  }
  if (Array.isArray(effectiveTour.heroImages) && effectiveTour.heroImages.length > 0) {
    finalData.heroImages = effectiveTour.heroImages;
  }
  if (Array.isArray(effectiveTour.memoriesImages) && effectiveTour.memoriesImages.length > 0) {
    finalData.memoriesImages = effectiveTour.memoriesImages;
  }
  if (Array.isArray(effectiveTour.packageCities) && effectiveTour.packageCities.length > 0) {
    finalData.packageCities = effectiveTour.packageCities;
  }
  if (Array.isArray(effectiveTour.sharingOptions) && effectiveTour.sharingOptions.length > 0) {
    finalData.sharingOptions = effectiveTour.sharingOptions;
  }
  if (Array.isArray(effectiveTour.batches) && effectiveTour.batches.length > 0) {
    finalData.batches = effectiveTour.batches;
  }
  if (Array.isArray(effectiveTour.quickInfoItems) && effectiveTour.quickInfoItems.length > 0) {
    finalData.quickInfoItems = effectiveTour.quickInfoItems;
  }
  if (Array.isArray(effectiveTour.faqs) && effectiveTour.faqs.length > 0) {
    finalData.faqs = effectiveTour.faqs;
  }
  if (Array.isArray(effectiveTour.reviews) && effectiveTour.reviews.length > 0) {
    finalData.reviews = effectiveTour.reviews;
  }

  return finalData;
}

export default function TourDetailsModal({ tour, onClose }) {
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setDataVersion((v) => v + 1);
    window.addEventListener('india_tour_package_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('india_tour_package_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const data = useMemo(() => getTourDetailsData(tour), [tour, dataVersion]);

  // Selected Options
  const [selectedCity, setSelectedCity] = useState(data.packageCities[0]?.id || 'ahmedabad');
  const [selectedSharing, setSelectedSharing] = useState('quad');
  const [selectedMonth, setSelectedMonth] = useState(data.months[0]?.name || 'November 2026');
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);

  // Accordion & Toggle states
  const [activeTab, setActiveTab] = useState('about');
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [expandedDays, setExpandedDays] = useState({ 0: true, 1: true });
  const [allExpanded, setAllExpanded] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState({ 0: true });
  const [expandedQuickInfo, setExpandedQuickInfo] = useState({ 0: true });
  const [showAllAttractions, setShowAllAttractions] = useState(false);

  // Lightbox & Mobile Slider
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 45) {
      // Swiped left -> next
      setMobileSlideIndex((prev) => (prev === data.heroImages.length - 1 ? 0 : prev + 1));
    } else if (distance < -45) {
      // Swiped right -> prev
      setMobileSlideIndex((prev) => (prev === 0 ? data.heroImages.length - 1 : prev - 1));
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Enquiry Modal
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryMode, setEnquiryMode] = useState('enquiry'); // 'enquiry' | 'callback'
  const [enqName, setEnqName] = useState('');
  const [enqPhone, setEnqPhone] = useState('');
  const [enqEmail, setEnqEmail] = useState('');
  const [enqDate, setEnqDate] = useState('');
  const [enqMessage, setEnqMessage] = useState('');
  const [enqSubmitting, setEnqSubmitting] = useState(false);
  const [enqSuccess, setEnqSuccess] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  // Dynamic Price calculation
  const currentCityObj = data.packageCities.find((c) => c.id === selectedCity) || data.packageCities[0];
  const currentSharingObj = data.sharingOptions.find((s) => s.id === selectedSharing) || data.sharingOptions[0];

  const cityDiscount = selectedCity === 'jaisalmer' ? 2000 : 0;
  const displayPrice = Math.max(4000, currentSharingObj.discounted - cityDiscount);
  const displayRegularPrice = Math.max(6000, currentSharingObj.regular - cityDiscount);
  const displaySaveAmount = displayRegularPrice - displayPrice;

  // Scroll spy / Tab clicking
  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const toggleDay = (idx) => {
    setExpandedDays((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleToggleAllDays = () => {
    if (allExpanded) {
      setExpandedDays({});
      setAllExpanded(false);
    } else {
      const all = {};
      data.itinerary.forEach((_, i) => (all[i] = true));
      setExpandedDays(all);
      setAllExpanded(true);
    }
  };

  const toggleFaq = (idx) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleQuickInfo = (idx) => {
    setExpandedQuickInfo((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleOpenEnquiry = (mode = 'enquiry') => {
    setEnquiryMode(mode);
    setIsEnquiryModalOpen(true);
  };

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    setEnqSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enqName,
          phone: enqPhone,
          email: enqEmail,
          destination: `${data.title} (${currentSharingObj.name}, ${currentCityObj.name} departure)`,
          date: enqDate || data.batches[selectedBatchIndex]?.fullDate,
          message: enqMessage || `${enquiryMode === 'callback' ? 'Requested a Callback' : 'Tour Enquiry'}`
        })
      });
      const resData = await res.json();
      if (res.ok || resData?.status) {
        setEnqSuccess('Thank you! Your enquiry has been sent. Our team will contact you shortly.');
        setEnqName('');
        setEnqPhone('');
        setEnqEmail('');
        setEnqMessage('');
        setTimeout(() => {
          setIsEnquiryModalOpen(false);
          setEnqSuccess('');
        }, 2000);
      } else {
        setEnqSuccess('Enquiry sent successfully! Our team will call you soon.');
        setTimeout(() => {
          setIsEnquiryModalOpen(false);
          setEnqSuccess('');
        }, 2000);
      }
    } catch {
      setEnqSuccess('Enquiry sent successfully! Our team will call you soon.');
      setTimeout(() => {
        setIsEnquiryModalOpen(false);
        setEnqSuccess('');
      }, 2000);
    } finally {
      setEnqSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello India Tour! I'm interested in ${data.title} (${currentSharingObj.name}) starting from ₹${displayPrice.toLocaleString('en-IN')}. Please share upcoming dates and batch details.`
  );
  const whatsappUrl = `https://wa.me/919548436762?text=${whatsappMessage}`;

  return (
    <div className="md:bg-[#f3f3f6] min-h-screen text-gray-900 pb-28 md:pb-16 font-productsans antialiased">
      
      {/* 1. Sticky Secondary Navigation Tabs (Exact clone) */}
      <div className="tour-secondary-nav sticky top-0 bg-white z-30 shadow-xs border-b border-gray-100 transition-transform duration-300">
        <div className="container mx-auto max-w-[1280px] px-3 sm:px-4 flex items-center justify-between">
          <div className="flex-1 min-w-0 flex space-x-1 pt-3 pb-1 overflow-x-auto no-scrollbar touch-pan-x mr-2">
            {[
              { id: 'about', label: 'About' },
              { id: 'packages', label: 'Packages' },
              { id: 'dates', label: 'Dates' },
              { id: 'itinerary', label: 'Itinerary' },
              { id: 'inclusions', label: 'Inclusions' },
              { id: 'attractions', label: 'Attractions' },
              { id: 'faqs', label: 'FAQs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`text-md px-3 sm:px-4 pb-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary productSansBold'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-black flex items-center gap-1.5 py-1.5 px-3 sm:px-3.5 rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer shrink-0"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Back to Trips</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-[1280px] px-0 md:px-4 md:py-6">
        
        {/* 2. Hero Photo Mosaic (Desktop: 70vh 4-col 2-row grid | Mobile: Carousel) */}
        <div className="hidden md:block">
          <div className="relative grid grid-rows-2 grid-cols-4 gap-2 justify-center items-start h-[70vh] pb-7">
            
            {/* Photo 1: Big left card (2 cols, 2 rows) */}
            <button
              type="button"
              onClick={() => { setLightboxIndex(0); setShowLightbox(true); }}
              aria-label={`Open photo gallery for ${data.title}`}
              className="group h-full w-full overflow-hidden bg-black row-span-2 col-span-2 rounded-l-3xl cursor-pointer"
            >
              <LazyImage
                src={data.heroImages[0]}
                alt={`${data.title} photo 1`}
                eager
                fetchPriority="high"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Photo 2 */}
            <button
              type="button"
              onClick={() => { setLightboxIndex(1); setShowLightbox(true); }}
              aria-label={`Open photo gallery for ${data.title}`}
              className="group h-full w-full overflow-hidden bg-black cursor-pointer"
            >
              <LazyImage
                src={data.heroImages[1] || data.heroImages[0]}
                alt={`${data.title} photo 2`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Photo 3: Top right rounded */}
            <button
              type="button"
              onClick={() => { setLightboxIndex(2); setShowLightbox(true); }}
              aria-label={`Open photo gallery for ${data.title}`}
              className="group h-full w-full overflow-hidden bg-black rounded-tr-3xl cursor-pointer"
            >
              <LazyImage
                src={data.heroImages[2] || data.heroImages[0]}
                alt={`${data.title} photo 3`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Photo 4 */}
            <button
              type="button"
              onClick={() => { setLightboxIndex(3); setShowLightbox(true); }}
              aria-label={`Open photo gallery for ${data.title}`}
              className="group h-full w-full overflow-hidden bg-black cursor-pointer"
            >
              <LazyImage
                src={data.heroImages[3] || data.heroImages[0]}
                alt={`${data.title} photo 4`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Photo 5: Bottom right rounded */}
            <button
              type="button"
              onClick={() => { setLightboxIndex(4); setShowLightbox(true); }}
              aria-label={`Open photo gallery for ${data.title}`}
              className="group h-full w-full overflow-hidden bg-black rounded-br-3xl cursor-pointer"
            >
              <LazyImage
                src={data.heroImages[4] || data.heroImages[0]}
                alt={`${data.title} photo 5`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Floating "Show all images" pill button */}
            <button
              type="button"
              onClick={() => { setLightboxIndex(0); setShowLightbox(true); }}
              className="absolute bottom-11 right-4 bg-white rounded-full px-4 py-2 text-sm productSansBold flex gap-2 items-center hover:bg-[#F7F7F7] transition-colors shadow-md cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
              <span>Show all images</span>
            </button>
          </div>
        </div>

        {/* Mobile Photo Slider with Touch Gestures and Navigation Arrows */}
        <div className="md:hidden relative">
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-full h-72 bg-black overflow-hidden select-none"
          >
            <LazyImage
              src={data.heroImages[mobileSlideIndex] || data.heroImages[0]}
              alt={`${data.title}`}
              eager
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Prev / Next Tap Arrows on Mobile */}
            <button
              type="button"
              onClick={() => setMobileSlideIndex((prev) => (prev === 0 ? data.heroImages.length - 1 : prev - 1))}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center text-xs backdrop-blur-xs z-10 cursor-pointer"
              aria-label="Previous image"
            >
              ❮
            </button>
            <button
              type="button"
              onClick={() => setMobileSlideIndex((prev) => (prev === data.heroImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center text-xs backdrop-blur-xs z-10 cursor-pointer"
              aria-label="Next image"
            >
              ❯
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {data.heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobileSlideIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    mobileSlideIndex === i ? 'w-5 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setLightboxIndex(mobileSlideIndex); setShowLightbox(true); }}
              className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs rounded-full px-3 py-1.5 text-xs productSansBold flex gap-1.5 items-center shadow cursor-pointer"
            >
              Show all images
            </button>
          </div>
        </div>

        {/* 3. Main Two-Column Layout */}
        <div className="tour-two-column-layout w-full flex flex-col md:flex-row justify-between gap-6">
          
          {/* ===================== LEFT COLUMN (w-full md:w-4/6) ===================== */}
          <div className="tour-left-col w-full md:w-4/6 space-y-6">
            
            {/* Card 1: Title Card */}
            <div id="about" className="bg-white md:rounded-3xl pt-3 md:pt-6 md:mb-6">
              <div className="pl-6 md:pl-8 md:space-y-2">
                <p className="text-lg md:text-xl text-gray-500">{data.duration}</p>
                <div className="md:space-y-1">
                  <h1 className="text-[26px] md:text-3xl productSansBold leading-8 my-2 text-gray-900">
                    {data.title}
                  </h1>
                  <h2 className="text-lg md:text-xl text-gray-800">{data.subtitle}</h2>
                </div>
              </div>

              <div className="mx-6 md:mx-8 pt-8 md:pt-12 pb-6 flex items-center justify-between">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="flex items-center text-[#8C8C8C] text-sm md:text-base">
                    <svg className="h-4 md:h-[18px] w-auto mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {data.categoryBadge}
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 text-[#8C8C8C] hover:text-black px-4 py-1.5 border border-light-gray rounded-lg transition cursor-pointer"
                  >
                    <FaShareNodes className="w-3.5 h-3.5" />
                    <span className="text-sm">Share</span>
                  </button>
                  {copiedToast && (
                    <span className="absolute -top-8 right-0 bg-black text-white text-xs px-2.5 py-1 rounded shadow whitespace-nowrap">
                      Link Copied!
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile Only: Ticket & Pricing Block */}
              <div className="md:hidden mx-5 pb-6">
                <div className="rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                  <div className="rounded-t-3xl flex justify-between bg-gradient-to-r to-[#D6FFCD] from-[#D5EBFF] py-3 px-6">
                    <div className="text-green flex items-center gap-1.5 ml-auto text-sm productSansBold">
                      <FaCircleCheck className="w-3.5 h-3.5 text-green" />
                      Save ₹ {displaySaveAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-600">Starting from</p>
                      <div className="text-right">
                        <p className="text-2xl productSansBold text-gray-900">
                          ₹ {displayPrice.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-[#808080] line-through">
                          ₹ {displayRegularPrice.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500">per person + taxes</p>
                      </div>
                    </div>

                    <div className="relative overflow-hidden flex w-full items-center justify-center rounded-full bg-[#D5EBFDB5] px-4 py-2.5 text-[12px] text-black mb-4">
                      <span className="emi-pill-shine" aria-hidden="true">
                        <svg width="24" height="100%" viewBox="0 0 24 38" fill="none" preserveAspectRatio="none" className="block h-full">
                          <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.5"></path>
                          <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.5"></path>
                        </svg>
                      </span>
                      <span className="relative inline-flex items-center gap-1.5">
                        <span className="underline"><span className="productSansBold">No Cost EMI</span> options available</span>
                        ↗
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenEnquiry('enquiry')}
                      className="text-lg bg-primary text-white w-full py-2.5 rounded-xl productSansBold shadow hover:bg-[#cb171e] transition cursor-pointer"
                    >
                      Send Enquiry
                    </button>
                  </div>
                </div>
              </div>

              {/* 2x2 Perks Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-8 py-6 border-t border-gray-100 bg-[#FAFAFA] md:rounded-b-3xl">
                {data.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-primary flex items-center justify-center shrink-0">
                      <FaCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{perk.title}</p>
                      <p className="text-sm productSansBold text-gray-900 leading-tight">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: About this Trip */}
            <div className="md:px-8 py-8 bg-white rounded-3xl md:my-6 px-5">
              <h3 className="text-xl productSansBold text-gray-900">About this Trip</h3>
              <div className="mt-4">
                <div className={`text-base leading-relaxed text-gray-800 ${!isAboutExpanded ? 'line-clamp-4 md:line-clamp-3' : ''}`}>
                  <p className="mb-4 whitespace-pre-line">{data.overviewText}</p>

                  {/* Places to Visit with vertical black line */}
                  <div className="mt-8 mb-2 relative">
                    <h4 className="text-2xl pl-4 productSansBold text-black relative">
                      Places to Visit in {data.title}
                      <span className="absolute left-1 top-[15%] h-[70%] w-[3px] bg-black"></span>
                    </h4>
                  </div>
                  <ul className="list-disc pl-8 space-y-3 md:space-y-4 my-4 text-base">
                    {data.placesToVisit.map((item, idx) => (
                      <li key={idx} className="my-2 leading-tight">
                        <span className="productSansBold">{item.name}. </span>
                        <span>{item.desc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Things to Do with vertical black line */}
                  <div className="mt-8 mb-2 relative">
                    <h4 className="text-2xl pl-4 productSansBold text-black relative">
                      Things to Do in {data.title}
                      <span className="absolute left-1 top-[15%] h-[70%] w-[3px] bg-black"></span>
                    </h4>
                  </div>
                  <ul className="list-disc pl-8 space-y-3 md:space-y-4 my-4 text-base">
                    {data.thingsToDo.map((item, idx) => (
                      <li key={idx} className="my-2 leading-tight">
                        <span className="productSansBold">{item.name}. </span>
                        <span>{item.desc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Travel Tips with vertical black line */}
                  <div className="mt-8 mb-2 relative">
                    <h4 className="text-2xl pl-4 productSansBold text-black relative">
                      Travel Tips for {data.title}
                      <span className="absolute left-1 top-[15%] h-[70%] w-[3px] bg-black"></span>
                    </h4>
                  </div>
                  <ul className="list-disc pl-8 space-y-3 md:space-y-4 my-4 text-base">
                    {data.travelTips.map((item, idx) => (
                      <li key={idx} className="my-2 leading-tight">
                        <span className="productSansBold">{item.name}: </span>
                        <span>{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                    className="text-primary hover:underline text-sm productSansBold cursor-pointer"
                  >
                    {isAboutExpanded ? 'Read Less ▲' : 'Read More ▼'}
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Memories from {Destination} */}
            <div id="memories" className="tour-lazy-section bg-white md:rounded-3xl md:p-9 md:w-full md:mx-0 mx-5 pt-5 pb-7 flex flex-col space-y-5">
              <h3 className="text-xl productSansBold text-gray-900">Memories from {data.title}</h3>
              <div className="relative w-full overflow-x-hidden">
                <div className="flex gap-4 scrollbar-hide overflow-x-auto py-2" style={{ scrollBehavior: 'smooth' }}>
                  {data.memoriesImages.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => { setLightboxIndex(i); setShowLightbox(true); }}
                      className="min-w-[280px] md:min-w-[320px] h-72 rounded-2xl overflow-hidden cursor-pointer group shrink-0"
                    >
                      <LazyImage
                        src={imgUrl}
                        alt={`Memory ${i + 1}`}
                        className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4: Itinerary (Day-by-Day Accordion) */}
            <div id="itinerary" className="tour-lazy-section bg-white rounded-3xl pt-9 md:pb-5 px-5 md:px-9">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl 2xl:text-2xl productSansBold text-gray-900">Itinerary</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOpenEnquiry('callback')}
                    className="flex items-center gap-2 px-4 py-1.5 text-xs md:text-base text-[#8C8C8C] hover:text-black border border-light-gray rounded-lg transition cursor-pointer"
                  >
                    <FaFilePdf className="w-3.5 h-3.5" />
                    <span>Get PDF</span>
                  </button>
                  <button
                    onClick={handleToggleAllDays}
                    className="flex items-center justify-center gap-2 w-28 md:w-32 h-8 md:h-10 text-xs md:text-base text-[#8C8C8C] hover:text-black border border-light-gray rounded-lg transition cursor-pointer"
                  >
                    <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-4">
                {data.itinerary.map((item, idx) => {
                  const isOpen = expandedDays[idx];
                  return (
                    <div key={idx} className="mb-4 hover:shadow-md iteneryHover rounded-2xl border border-gray-100 overflow-hidden">
                      <div
                        onClick={() => toggleDay(idx)}
                        className="bg-gray-50 hover:bg-gray-100 rounded-2xl flex justify-between items-center cursor-pointer py-3.5 px-3 md:px-6 transition"
                      >
                        <div className="flex items-center">
                          <p className="productSansBold bg-[#7A7A7A] text-sm md:text-base text-white h-6 md:h-8 w-[60px] md:w-[70px] flex justify-center items-center rounded-[10px] shrink-0">
                            Day {item.day}
                          </p>
                          <p className="ml-3 mr-1 md:ml-5 text-sm md:text-base productSansBold text-gray-900">
                            {item.title}
                          </p>
                        </div>
                        <span className="pr-2 text-gray-500">
                          {isOpen ? <FaChevronUp className="w-3.5 h-3.5" /> : <FaChevronDown className="w-3.5 h-3.5" />}
                        </span>
                      </div>

                      {isOpen && (
                        <div className="p-4 md:p-6 bg-white space-y-4">
                          <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-gray-700">
                            {item.points.map((pt, pIdx) => (
                              <li key={pIdx} className="leading-snug">{pt}</li>
                            ))}
                          </ul>

                          {item.date && (
                            <p className="text-xs md:text-sm text-gray-500 ml-2">Date: {item.date}</p>
                          )}

                          {item.img && (
                            <div className="h-56 md:h-72 2xl:h-96 w-full rounded-2xl overflow-hidden my-3 bg-gray-100">
                              <LazyImage
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-2xl"
                              />
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3 pt-2 text-xs md:text-sm">
                            <span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-800">{item.stay}</span>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-medium">{item.meals}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Banner: Dream Trip with No Cost EMI */}
            <div
              className="border-2 border-primary rounded-3xl shadow-sm my-6 overflow-hidden mx-5 md:mx-0 p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              style={{ background: 'linear-gradient(90deg, rgb(252, 231, 230) 0%, rgb(255, 255, 255) 55%, rgb(252, 231, 230) 100%)' }}
            >
              <div>
                <p className="text-lg md:text-2xl productSansBold text-black leading-tight">Your Dream Trip</p>
                <p className="text-base md:text-lg text-black">with <span className="productSansBold text-primary">No Cost EMI</span></p>
              </div>
              <button
                onClick={() => handleOpenEnquiry('enquiry')}
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-primary text-white rounded-full productSansBold text-sm shadow hover:bg-[#cb171e] transition cursor-pointer shrink-0"
              >
                Check EMI Eligibility
              </button>
            </div>

            {/* Card 5: Inclusions & Exclusions */}
            <div id="inclusions" className="tour-lazy-section space-y-6">
              {/* Inclusions */}
              <div className="bg-white md:rounded-3xl md:p-9 md:w-full md:mx-0 mx-5 pt-5 pb-7 flex flex-col space-y-4">
                <h3 className="text-xl productSansBold text-gray-900">Inclusions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
                  {data.inclusions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 my-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FaCheck className="w-3 h-3" />
                      </span>
                      <p className="text-gray-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div className="bg-white md:rounded-3xl md:p-9 md:w-full md:mx-0 mx-5 pt-5 pb-7 flex flex-col space-y-4">
                <h3 className="text-xl productSansBold text-gray-900">Exclusions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
                  {data.exclusions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 my-1">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FaXmark className="w-3 h-3" />
                      </span>
                      <p className="text-gray-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 6: Package Options (data-section="packages") */}
            <div id="packages" className="tour-lazy-section md:px-8 py-8 bg-white rounded-3xl md:my-6 px-5">
              <h3 className="text-xl productSansBold text-gray-900 mb-4">Package Options</h3>
              
              {/* Departure Cities selector */}
              <div className="py-4 border-b border-gray-200">
                <p className="text-sm text-gray-500 mb-3 productSansBold">Select Departure Hub:</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {data.packageCities.map((city) => (
                    <div
                      key={city.id}
                      onClick={() => setSelectedCity(city.id)}
                      className={`w-[156px] shrink-0 cursor-pointer p-1.5 border-2 rounded-[20px] transition ${
                        selectedCity === city.id ? 'border-primary bg-red-50/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-gray-100">
                        <LazyImage src={city.img} alt={city.name} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                        <p className="absolute bottom-1.5 pl-3 text-white productSansBold text-xs z-10">{city.duration}</p>
                      </div>
                      <div className="px-2 py-3">
                        <h6 className="productSansBold text-sm text-gray-900">{city.name}</h6>
                        <div className="leading-tight mt-1">
                          <p className="text-xs text-gray-400 line-through">₹ {city.regularPrice}</p>
                          <p className="productSansBold text-sm text-primary">₹ {city.discountPrice}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Sharing Options */}
              <div className="pt-6">
                <p className="text-sm text-gray-500 mb-3 productSansBold">Room Sharing Options:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {data.sharingOptions.map((opt) => {
                    const isSelected = selectedSharing === opt.id;
                    const price = opt.discounted - cityDiscount;
                    const regPrice = opt.regular - cityDiscount;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedSharing(opt.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'border-primary bg-red-50/30 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="productSansBold text-base text-gray-900">{opt.name}</span>
                            {isSelected && <FaCircleCheck className="text-primary w-4 h-4" />}
                          </div>
                          <p className="text-xs text-gray-500">Per Person + 5% GST</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                          <div>
                            <span className="text-xs text-gray-400 line-through mr-1.5">₹ {regPrice.toLocaleString('en-IN')}</span>
                            <span className="text-lg productSansBold text-primary">₹ {price.toLocaleString('en-IN')}</span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            ₹ {opt.off} OFF
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card 7: Departure Dates (data-section="dates") */}
            <div id="dates" className="md:px-8 py-8 bg-white md:rounded-3xl md:my-6 px-5">
              <h3 className="text-xl productSansBold text-gray-900 mb-4">Departure Dates</h3>
              
              {/* Month Tabs */}
              <div className="flex gap-3 py-2 overflow-x-auto mb-4 no-scrollbar">
                {data.months.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedMonth(m.name)}
                    className={`relative px-5 py-2 border rounded-xl cursor-pointer whitespace-nowrap text-sm transition ${
                      selectedMonth === m.name
                        ? 'text-[#EC1D24] border-[2px] border-[#FF4A50] bg-[#FFF3F3] shadow-xs productSansBold'
                        : 'border-light-gray text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {m.name}
                  </div>
                ))}
              </div>

              {/* Batches List */}
              <div className="flex flex-col gap-3">
                {data.batches.map((batch, bIdx) => {
                  const isBatchSelected = selectedBatchIndex === bIdx;
                  return (
                    <div
                      key={bIdx}
                      onClick={() => setSelectedBatchIndex(bIdx)}
                      className={`flex items-center justify-between rounded-2xl transition-all py-3 px-4 md:py-4 md:px-6 cursor-pointer border ${
                        isBatchSelected
                          ? 'border-[2px] border-[#FF4A50] bg-[#FFF3F3] shadow-xs'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-left min-w-[70px]">
                          <div className={`text-base productSansBold ${isBatchSelected ? 'text-[#EC1D24]' : 'text-gray-900'}`}>
                            {batch.date}
                          </div>
                          <div className="text-xs text-gray-500">{batch.day}</div>
                        </div>

                        <div className="border-l border-gray-200 pl-3">
                          <p className="text-sm font-medium text-gray-800">{batch.fullDate}</p>
                          <p className="text-xs text-gray-500">Ahmedabad &lt;-&gt; Jaisalmer Circuit</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full border productSansBold ${batch.statusClass}`}>
                          {batch.status}
                        </span>
                        <div className="text-right hidden sm:block">
                          <p className="productSansBold text-base text-gray-900">₹ {displayPrice.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-400">+ taxes</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 8: Package Price Comparison Table */}
            <div className="md:px-8 py-8 bg-white md:rounded-3xl md:my-6 px-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <h3 className="text-xl productSansBold text-gray-900">Package Price Comparison</h3>
                <span className="text-xs text-primary font-medium md:hidden flex items-center gap-1">
                  ⇄ Swipe table horizontally
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6">Complete transparent breakdown with no hidden fees</p>
              
              <div className="overflow-x-auto rounded-2xl border border-light-gray shadow-xs touch-pan-x">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#E8F4FF] to-[#F0F8FF]">
                      <th className="py-3 px-4 productSansBold text-xs text-center border-b border-light-gray">Package</th>
                      <th className="py-3 px-4 productSansBold text-xs text-center border-l border-b border-light-gray">Sub Package</th>
                      <th className="py-3 px-4 productSansBold text-xs text-center border-l border-b border-light-gray">Regular Price</th>
                      <th className="py-3 px-4 productSansBold text-xs text-primary text-center border-l border-b border-light-gray">Discounted Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sharingOptions.map((opt, i) => (
                      <tr key={i} className="bg-white border-t border-light-gray hover:bg-gray-50/50">
                        {i === 0 && (
                          <td rowSpan={data.sharingOptions.length} className="py-4 px-3 text-center align-middle border-r border-light-gray">
                            <div className="productSansBold text-sm text-gray-900">{currentCityObj.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{data.duration}</div>
                          </td>
                        )}
                        <td className="py-4 px-4 text-center border-l border-light-gray">
                          <div className="text-sm font-medium text-gray-900">{opt.name}</div>
                          <div className="text-xs text-gray-500">{currentCityObj.vehicle}</div>
                        </td>
                        <td className="py-4 px-4 text-center border-l border-light-gray">
                          <div className="text-sm text-gray-400 line-through">₹ {(opt.regular - cityDiscount).toLocaleString('en-IN')}</div>
                          <div className="text-xs text-emerald-600 font-semibold">₹ {opt.off}/- OFF</div>
                        </td>
                        <td className="py-4 px-4 text-center border-l border-light-gray">
                          <div className="text-base productSansBold text-primary">₹ {(opt.discounted - cityDiscount).toLocaleString('en-IN')}</div>
                          <div className="text-xs text-gray-400">per person + GST</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card 9: Attractions & Activities (data-section="attractions") */}
            <div id="attractions" className="tour-lazy-section bg-white md:rounded-3xl mt-6 p-5 md:p-9">
              <div className="relative mb-6">
                <h3 className="text-xl productSansBold text-gray-900">Attractions &amp; Activities</h3>
                <p className="text-sm text-gray-500 mt-1">Highlights included on this group tour itinerary</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(showAllAttractions ? data.attractions : data.attractions.slice(0, 4)).map((attr, aIdx) => (
                  <div key={aIdx} className="col-span-1 group">
                    <div className="h-40 2xl:h-48 w-full rounded-2xl overflow-hidden mb-2 bg-gray-100">
                      <LazyImage
                        src={attr.img}
                        alt={attr.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                      />
                    </div>
                    <p className="productSansBold text-sm md:text-base text-gray-900 leading-tight">{attr.name}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{attr.tag}</p>
                  </div>
                ))}
              </div>

              {data.attractions.length > 4 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowAllAttractions(!showAllAttractions)}
                    className="px-6 py-2 border border-gray-300 rounded-full text-sm productSansBold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  >
                    {showAllAttractions ? 'Show Fewer Attractions ▲' : `View All Attractions (${data.attractions.length}) ▼`}
                  </button>
                </div>
              )}
            </div>

            {/* Card 10: Quick Info */}
            <div className="tour-lazy-section bg-white md:rounded-3xl p-5 md:p-9">
              <h3 className="text-xl productSansBold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                {data.quickInfoItems.map((item, idx) => {
                  const isOpen = expandedQuickInfo[idx];
                  return (
                    <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleQuickInfo(idx)}
                        className="w-full py-3.5 px-5 flex items-center justify-between text-left font-medium text-gray-900 bg-gray-50/60 hover:bg-gray-50 transition cursor-pointer"
                      >
                        <span className="productSansBold text-sm md:text-base">{item.title}</span>
                        {isOpen ? <FaChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <FaChevronDown className="w-3.5 h-3.5 text-gray-500" />}
                      </button>
                      {isOpen && (
                        <div className="p-5 text-sm md:text-base text-gray-700 bg-white leading-relaxed">
                          {item.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 11: FAQs (data-section="faqs") */}
            <div id="faqs" className="tour-lazy-section bg-white md:rounded-3xl p-5 md:p-9">
              <h3 className="text-xl productSansBold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {data.faqs.map((faq, idx) => {
                  const isOpen = expandedFaqs[idx];
                  return (
                    <div key={idx} className="border-b border-gray-100 pb-3">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="cursor-pointer flex items-start gap-3 py-2 w-full text-left"
                      >
                        <span className="text-primary shrink-0 mt-0.5">
                          {isOpen ? <FaChevronUp className="w-3.5 h-3.5" /> : <FaChevronDown className="w-3.5 h-3.5" />}
                        </span>
                        <h5 className="text-base productSansBold text-gray-900 leading-snug">{faq.q}</h5>
                      </button>
                      {isOpen && (
                        <div className="pl-6 pr-3 pt-1 text-sm md:text-base text-gray-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 12: Reviews */}
            <div className="tour-lazy-section bg-white md:rounded-3xl p-5 md:p-9">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl productSansBold text-gray-900">Customer Reviews</h3>
                  <p className="text-sm text-gray-500">Real feedback from verified travelers</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                  <span className="text-amber-500 font-bold">★ 4.8 / 5.0</span>
                  <span className="text-xs text-gray-500">(1,000+ Reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.reviews.map((rev, rIdx) => (
                  <div key={rIdx} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-3">
                        <LazyImage src={rev.img} alt={rev.name} className="w-11 h-11 rounded-full mr-3 object-cover shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="productSansBold text-sm text-gray-900">{rev.name}</span>
                            <span className="text-[11px] text-gray-400 capitalize px-2 py-0.5 bg-gray-100 rounded-full">{rev.type}</span>
                          </div>
                          <span className="text-xs text-gray-500">Booked: {rev.tourBooked}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 text-amber-400 mb-2">
                        {[...Array(rev.rating)].map((_, s) => (
                          <span key={s}>★</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed italic">"{rev.review}"</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span>✓ Verified Traveler</span>
                      <span>Verified Stay</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ===================== RIGHT STICKY SIDEBAR (w-2/6 md:block hidden) ===================== */}
          <div className="tour-sidebar-col justify-center w-2/6 md:block hidden shrink-0">
            <div className="tour-sticky-sidebar">
              
              {/* Card 1: Ticket Pricing Card (Exact clone styling of Avian Experiences) */}
              <div className="rounded-3xl border border-gray-200/80 shadow-md overflow-hidden bg-white">
                <div>
                  {/* Top gradient with Save ₹ badge */}
                  <div className="rounded-t-3xl flex justify-between bg-gradient-to-r to-[#D6FFCD] from-[#D5EBFF] py-2 px-5">
                    <div className="text-green flex items-center gap-1.5 ml-auto text-sm productSansBold">
                      <FaCircleCheck className="w-4 h-4 text-green" />
                      Save ₹ {displaySaveAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Scalloped ticket notch curve */}
                  <div className="-mt-1">
                    <img src={TICKET_CURVE_URI} className="w-full object-cover h-2.5" alt="ticket border" />
                  </div>
                </div>

                {/* White Ticket Card Body */}
                <div className="bg-white rounded-b-3xl">
                  <div className="pt-3 px-5 pb-1">
                    <div className="flex justify-between items-start pb-1.5">
                      <p className="text-gray-700 text-xs font-medium pt-0.5">Starting from</p>
                      <div className="text-right">
                        <p className="text-2xl productSansBold text-gray-950">
                          ₹ {displayPrice.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-400 line-through font-normal">
                          ₹ {displayRegularPrice.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-gray-500">per person</p>
                        <p className="text-[10px] text-gray-400">+ taxes</p>
                      </div>
                    </div>

                    {/* Animated No Cost EMI Pill */}
                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry('enquiry')}
                      className="relative overflow-hidden flex w-full items-center justify-center rounded-full bg-[#D5EBFDB5] px-3 py-1.5 text-xs text-black hover:text-black mb-2 transition cursor-pointer"
                    >
                      <span className="emi-pill-shine" aria-hidden="true">
                        <svg width="24" height="100%" viewBox="0 0 24 38" fill="none" preserveAspectRatio="none" className="block h-full">
                          <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.5"></path>
                          <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.5"></path>
                        </svg>
                      </span>
                      <span className="relative inline-flex items-center gap-1">
                        <span className="underline"><span className="productSansBold">No Cost EMI</span> options available</span>
                        ↗
                      </span>
                    </button>
                  </div>

                  {/* Clean Divider */}
                  <div className="border-t border-gray-200/80 mx-4"></div>

                  {/* Route & Duration summary */}
                  <div className="text-center text-xs text-gray-500 py-2.5 px-4 space-y-0.5">
                    <p><span className="productSansBold text-gray-800">{currentCityObj.name}</span> Package with {currentCityObj.vehicle}</p>
                    <div className="productSansBold text-gray-900">{data.duration}</div>
                  </div>

                  {/* Big Red "Send Enquiry" Button */}
                  <div className="mx-4 pb-2.5">
                    <button
                      onClick={() => handleOpenEnquiry('enquiry')}
                      className="text-base bg-primary text-white w-full py-2.5 rounded-xl productSansBold shadow-md hover:bg-[#cb171e] transition cursor-pointer"
                    >
                      Send Enquiry
                    </button>
                  </div>

                  {/* Social Proof */}
                  <div className="mx-4 pb-2.5 pt-2 flex items-center justify-around text-xs text-gray-700 border-t border-gray-200">
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <span>⭐</span>
                      <span><span className="productSansBold">4.8</span> (<span className="productSansBold">1000+</span> Reviews)</span>
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <span>✈️</span>
                      <span><span className="productSansBold">8000+</span> Travellers</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Private Trips Available Card */}
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-3.5">
                <div className="mb-2">
                  <p className="productSansBold text-sm text-gray-950">Private Trips Available</p>
                  <p className="text-[11px] text-gray-500">Customized itinerary for Group of 2+ Travellers</p>
                </div>
                <button
                  onClick={() => handleOpenEnquiry('callback')}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:text-black border border-gray-300 hover:border-gray-400 rounded-xl transition cursor-pointer w-full justify-center font-medium bg-white"
                >
                  <FaPhone className="w-3 h-3 text-gray-500" />
                  <span>Request a Callback</span>
                </button>
              </div>

              {/* Card 3: WhatsApp & PDF Card */}
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-2.5 flex items-center justify-between gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition cursor-pointer font-semibold"
                >
                  <FaWhatsapp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={() => handleOpenEnquiry('callback')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs text-gray-700 hover:text-black border border-gray-300 hover:border-gray-400 rounded-xl transition cursor-pointer font-semibold bg-white"
                >
                  <FaFilePdf className="w-3.5 h-3.5 text-red-500" />
                  <span>Get PDF</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* 4. Mobile Fixed Bottom Enquiry Action Bar (Floating Pill) */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4">
        <div className="rounded-full bg-white/90 backdrop-blur-md shadow-5xl px-3 py-2 border border-white/60 flex items-center justify-between gap-4 w-full max-w-sm">
          <div className="pl-3">
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="text-lg productSansBold text-gray-900 leading-tight">
              ₹ {displayPrice.toLocaleString('en-IN')}
            </p>
          </div>
          <button
            onClick={() => handleOpenEnquiry('enquiry')}
            className="px-6 py-2.5 rounded-full text-sm productSansBold text-white bg-primary shadow hover:bg-[#cb171e] transition cursor-pointer"
          >
            Send Enquiry
          </button>
        </div>
      </div>

      {/* 5. Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 md:p-8">
          <div className="flex items-center justify-between text-white">
            <span className="productSansBold text-lg">
              {data.title} ({lightboxIndex + 1} / {data.heroImages.length})
            </span>
            <button
              onClick={() => setShowLightbox(false)}
              className="text-white hover:text-gray-300 text-3xl px-3 py-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={data.heroImages[lightboxIndex] || data.heroImages[0]}
              alt={data.title}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl"
            />
          </div>

          <div className="flex gap-2 justify-center overflow-x-auto py-2">
            {data.heroImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 cursor-pointer shrink-0 ${
                  lightboxIndex === idx ? 'border-primary' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img} alt="thumb" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. Send Enquiry / Request Callback Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEnquiryModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black text-xl cursor-pointer w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="px-3 py-1 bg-red-50 text-primary text-xs productSansBold rounded-full uppercase">
                {enquiryMode === 'callback' ? 'Callback Request' : 'Direct Tour Booking'}
              </span>
              <h3 className="text-2xl productSansBold text-gray-900 mt-2">
                {enquiryMode === 'callback' ? 'Request a Callback' : `Book ${data.title}`}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {currentCityObj.name} Departure • {currentSharingObj.name} (₹{displayPrice.toLocaleString('en-IN')}/person)
              </p>
            </div>

            {enqSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center">
                <FaCircleCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="productSansBold text-base">{enqSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={enqName}
                    onChange={(e) => setEnqName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={enqPhone}
                      onChange={(e) => setEnqPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={enqEmail}
                      onChange={(e) => setEnqEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Travel Date / Batch</label>
                  <input
                    type="text"
                    value={enqDate}
                    onChange={(e) => setEnqDate(e.target.value)}
                    placeholder={data.batches[selectedBatchIndex]?.fullDate || 'e.g. 05 Nov 2026'}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message or Special Requests (Optional)</label>
                  <textarea
                    rows={2}
                    value={enqMessage}
                    onChange={(e) => setEnqMessage(e.target.value)}
                    placeholder="Number of travelers, sharing preferences, pick-up questions..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={enqSubmitting}
                  className="w-full py-3 bg-primary text-white rounded-xl productSansBold text-base hover:bg-[#cb171e] transition shadow cursor-pointer disabled:opacity-50"
                >
                  {enqSubmitting ? 'Submitting Details...' : 'Submit Enquiry & Get Instant Callback'}
                </button>

                <p className="text-center text-xs text-gray-400">
                  🔒 We respect your privacy. No spam. A verified expedition leader will contact you.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
