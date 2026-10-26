export const groupFilterCategories = [
  { id: 'all', name: 'All' },
  { id: 'jaisalmer', name: 'Jaisalmer' },
  { id: 'meghalaya', name: 'Meghalaya' },
  { id: 'kashmir', name: 'Kashmir' },
  { id: 'spiti-valley', name: 'Spiti Valley' },
  { id: 'uttarakhand', name: 'Uttarakhand' },
  { id: 'ladakh', name: 'Ladakh' }
];

export const groupTripsList = [
  // ==================== WINTER GROUP TRIPS ====================
  {
    id: 'group-jaisalmer-winter',
    category: 'jaisalmer',
    seasonType: 'winter',
    title: 'Jaisalmer Group Trip',
    route: 'Free Camel Safari',
    duration: '3 Days 2 Nights',
    price: 7800,
    originalPrice: 10800,
    saveAmount: '3,000',
    badge: 'Save 3,000',
    secondaryBadge: null,
    images: [
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/d5b19425-cec1-4e3c-81bb-7f00f04f644d/Camel_Safari.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek-memories/d30902d7-f575-4bc3-a483-32f64e67bcef/DSC00719.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek-memories/e8827dda-9c4a-4c18-b975-29b75cfc61da/DJI_0030.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/59b01d6e-0709-430d-9bdf-905a8b209d92/Bada_Bagh_Jaisalmer_5.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/0d9ea3a2-36db-4a3d-a099-f8338d0160cd/DSC00297.jpg'
    ],
    overview: 'Experience the Thar Desert magic: camp in luxury Swiss tents at Sam Sand Dunes, ride camels across golden ripples of sand, and celebrate with Rajasthani folk music and campfire.',
    inclusions: [
      'Deluxe Swiss Tent stay in Sam Sand Dunes',
      'Sunset Camel Safari and Jeep Dune Bashing',
      'Rajasthani cultural dance and musical night with dinner',
      'Jaisalmer Golden Fort & Patwon ki Haveli walking tour',
      'Transportation in AC vehicle with trip captain'
    ]
  },
  {
    id: 'group-meghalaya-winter',
    category: 'meghalaya',
    seasonType: 'winter',
    title: 'Meghalaya Group Trip',
    route: 'Waterfalls & Root Bridges',
    duration: '6 Days 5 Nights',
    price: 20800,
    originalPrice: 23800,
    saveAmount: '3,000',
    badge: 'Save 3,000',
    secondaryBadge: null,
    images: [
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/a955fba9-3c6f-4f92-9502-80b374faf078/seven_sisters_falls_9.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/a9469af1-87c1-4140-9d69-8c185138398f/Double_Decker_Living_Root_Bridge_7.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/58600f59-3c14-45b2-bb0e-83c5b2bbf8a0/shnongpdeng_Village_1.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/b8cd0aff-7a58-46cd-b72d-81285dcec4d8/arwah_cave_1.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/2697971c-ae11-4f06-84d8-33e364b49ef5/Krang_Suri_Falls_7.jpg'
    ],
    overview: 'Explore the Abode of Clouds: trek to the ancient Double Decker Living Root Bridge, witness thunderous waterfalls in Cherrapunji, and boat on crystal-clear Dawki river.',
    inclusions: [
      'Double Decker Living Root Bridge guided trek',
      'Boating on crystal clear Dawki Umngot river',
      'Nohkalikai, Wei Sawdong & Seven Sisters waterfalls',
      'Mawlynnong cleanest village heritage walk',
      'Boutique stays and verified group trip leader'
    ]
  },
  {
    id: 'group-meghalaya-kaziranga-winter',
    category: 'meghalaya',
    seasonType: 'winter',
    title: 'Meghalaya Group Trip with Kaziranga',
    route: 'Waterfalls, Root Bridges & Safari',
    duration: '7 Days 6 Nights',
    price: 24800,
    originalPrice: 28800,
    saveAmount: '4,000',
    badge: 'Save 4,000',
    secondaryBadge: null,
    images: [
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/ca79229b-9c48-423e-98af-4f6cf0e2f338/boating_4.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/5a7685fc-fa99-4b84-a93b-cd0f7c8094fa/jeep_safari_7.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/2905a780-cc64-49a9-9e13-af9d4f56bad1/Double_Decker_Living_Root_Bridge_7.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/004b5d7c-2e4f-4d9b-be00-4eba8497780b/seven_sisters_falls_9.jpg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/39f6a62c-4264-422e-a5ec-589b978c3376/Krang_Suri_Falls_1.jpg'
    ],
    overview: 'The complete Northeast group experience combining wildlife safaris in Kaziranga National Park with living root bridges and limestone caves of Meghalaya.',
    inclusions: [
      'Jeep Safari in Kaziranga National Park',
      'Living root bridge trek & Rainbow Falls hike',
      'Transparent boating on Dawki river',
      'Shillong Police Bazaar cafe trail',
      'Dedicated AC vehicle throughout the tour'
    ]
  },
  {
    id: 'group-kashmir-winter',
    category: 'kashmir',
    seasonType: 'winter',
    title: 'Kashmir Winter Trip',
    route: 'with Gulmarg & Sonmarg',
    duration: '6 Days 5 Nights',
    price: 22800,
    originalPrice: 26800,
    saveAmount: '4,000',
    badge: 'Save 4,000',
    secondaryBadge: null,
    images: [
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/b5d3520b-61c6-4a83-9bdb-5901de243d27',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/79c09837-fd85-477b-a54d-64802cfd6974',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/2e72d619-ac99-4230-8b26-8161cb387ddb',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/5eca5599-5bdc-494d-8be9-e67e2f537d1a',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/6deaa300-4423-4566-a5c5-51408b8e19d3'
    ],
    overview: 'Witness Kashmir turned into a fairytale winter wonderland: snow fights in Gulmarg, cable car ride, Sonamarg glacier vistas, and houseboat stay on Dal Lake.',
    inclusions: [
      '1 Night Deluxe Houseboat on Dal Lake with Shikara ride',
      'Gulmarg Gondola snow activity assistance',
      'Sonamarg snow meadow excursion',
      'Heated hotel rooms & MAP meal plan (Breakfast & Dinner)',
      'Experienced group trip captain throughout'
    ]
  },
  {
    id: 'group-kashmir-delhi-winter',
    category: 'kashmir',
    seasonType: 'winter',
    title: 'Kashmir Winter Trip from Delhi',
    route: 'with Gulmarg & Sonmarg',
    duration: '8 Days 7 Nights',
    price: 26800,
    originalPrice: 30800,
    saveAmount: '4,000',
    badge: 'Save 4,000',
    secondaryBadge: null,
    images: [
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/ce6bdd4e-236a-4ad7-805c-bbd6db768708',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/7d040232-1b40-463f-abc4-3a145e1ff21e',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/54822ab3-f445-444c-af33-e67b69345d84',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/8ef59c8a-f2e4-40b1-8f00-db88bd1c34e7',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/507144c6-6ff4-41a5-9c54-30fbd83dfe98'
    ],
    overview: 'Direct group expedition from Delhi to Srinagar covering Gulmarg, Sonamarg, Pahalgam, and Dal Lake with complete travel logistics taken care of.',
    inclusions: [
      'Delhi to Delhi train / sleeper transport included',
      'Gulmarg Gondola & snowmobile experience points',
      'Pahalgam Betaab Valley & Aru Valley excursion',
      'Houseboat stay and romantic Shikara sunset',
      'Warm group tour captain and 24/7 support'
    ]
  },
  {
    id: 'group-spiti-winter-4x4',
    category: 'spiti-valley',
    seasonType: 'winter',
    title: 'Winter Spiti 4x4 Expedition',
    route: 'with Chandratal Lake',
    duration: '8 Days 7 Nights',
    price: 21800,
    originalPrice: 25800,
    saveAmount: '4,000',
    badge: 'Save 4,000',
    secondaryBadge: null,
    images: [
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/85581134-8d74-4fca-a1bf-614c077c7dfb/Spiti_Valley_Group_Photo_2.jpeg',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/a3502211-239b-41fc-8b09-2e1c984ea138',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/7493d033-2094-47b5-aae9-54895427b03a',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/14bb61ff-53f9-44bf-9861-0f4ae5fc7849',
      'https://d37ng3z2ha8i9t.cloudfront.net/trek/0477b847-c682-43e1-b146-a7ead0d3c652'
    ],
    overview: 'A thrilling 4x4 snow drive into white Spiti Valley: witness frozen waterfalls, Key Monastery under snow blankets, and drive through high mountain passes.',
    inclusions: [
      'Rugged 4x4 vehicle with snow chains for winter safety',
      'Local homestays with bukhari room heaters',
      'Key Monastery, Chicham Bridge & Hikkim highest post office',
      'MAP meal plan with hot local Himachali cuisine',
      'Oxygen cylinder backup and mountain expert captain'
    ]
  },
  {
    id: 'group-spiti-delhi-winter',
    category: 'spiti-valley',
    seasonType: 'winter',
    title: 'Winter Spiti Group Trip from Delhi',
    route: 'with Chitkul Stay',
    duration: '9 Days 8 Nights',
    price: 26999,
    originalPrice: 30999,
    badge: 'SAVE ₹4,000',
    secondaryBadge: null,
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Full circuit expedition from Delhi into snow-clad Kinnaur and Spiti. Halt at Chitkul—the last village of India—and conquer the frozen valleys of Kaza.',
    inclusions: [
      'Delhi to Delhi Tempo Traveler / 4x4 transport',
      'Chitkul winter homestay experience with bonfire',
      'Tabo 1000-year-old monastery & Dhankar fort visit',
      'All inner line permits, toll taxes and fuel',
      'Experienced winter expedition leader'
    ]
  },
  {
    id: 'group-spiti-road-winter',
    category: 'spiti-valley',
    seasonType: 'winter',
    title: 'Winter Spiti Road Trip',
    route: 'with Kaza & Chandratal',
    duration: '8 Days 7 Nights',
    price: 21999,
    originalPrice: 25999,
    badge: 'Early Bird',
    secondaryBadge: 'SAVE ₹4,000',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Witness the surreal white Himalayas on this guided group road trip across Kaza, Langza Buddha statue, and frozen riverbeds of Spiti.',
    inclusions: [
      'Modified winter vehicle with expert mountain chauffeur',
      'Traditional homestay accommodation with warm hospitality',
      'Breakfast and dinner included on all days',
      'Visit to Komic, Hikkim and Chicham Bridge',
      'Trip captain and emergency medical kit'
    ]
  },

  // ==================== SUMMER GROUP TRIPS ====================
  {
    id: 'group-kedarnath-ahmedabad',
    category: 'uttarakhand',
    seasonType: 'summer',
    title: 'Kedarnath Group Trip from Ahmedabad',
    route: 'with Chopta & Tungnath',
    duration: '9 Days 8 Nights',
    price: 20999,
    originalPrice: 23999,
    badge: 'SAVE ₹3,000',
    secondaryBadge: null,
    images: [
      'https://images.unsplash.com/photo-1612438214708-f428a707dd4e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1698574996391-73f103113f60?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522506209496-4536d9020ec4?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Sacred Himalayan pilgrimage departing from Ahmedabad: Darshan at Kedarnath Dham, trek to Tungnath highest Shiva temple, and camping at Chopta meadows.',
    inclusions: [
      'Ahmedabad to Haridwar train tickets & AC transport in hills',
      'Night stay near Kedarnath temple and Chopta Swiss tents',
      'Tungnath & Chandrashila summit trek guidance',
      'All vegetarian meals (Breakfast & Dinner)',
      'Experienced pilgrimage leader & medical support'
    ]
  },
  {
    id: 'group-kedarnath-delhi',
    category: 'uttarakhand',
    seasonType: 'summer',
    title: 'Kedarnath Group Trip from Delhi',
    route: 'with Chopta & Tungnath',
    duration: '7 Days 6 Nights',
    price: 17999,
    originalPrice: 20999,
    badge: 'SAVE ₹3,000',
    secondaryBadge: null,
    images: [
      'https://images.unsplash.com/photo-1698574996391-73f103113f60?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612438214708-f428a707dd4e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591730483538-6b6dd8687820?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The most popular Kedarnath yatra package from Delhi: seamless group logistics, stay near Kedarnath temple, and sunrise views from Chandrashila Peak.',
    inclusions: [
      'Delhi to Delhi AC Tempo Traveler / Bus transport',
      'Clean hotel & camp stays in Guptkashi, Kedarnath & Chopta',
      'Trek captain support for Kedarnath 16km trek',
      'Wholesome breakfast and dinner daily',
      'Darshan registration and token assistance'
    ]
  },
  {
    id: 'group-spiti-bike-summer',
    category: 'spiti-valley',
    seasonType: 'summer',
    title: 'Spiti Valley Bike Trip',
    route: 'Delhi - Chitkul - Manali - Delhi',
    duration: '8 Days 7 Nights',
    price: 25999,
    originalPrice: 29999,
    badge: 'Early Bird',
    secondaryBadge: 'SAVE ₹4,000',
    images: [
      'https://images.unsplash.com/photo-1653844573020-71f77a0ccb8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Ride the ultimate high-altitude motorcycle circuit on Royal Enfield Himalayan. Conquer Rohtang, Kunzum Pass, and camp under millions of stars at Chandratal Lake.',
    inclusions: [
      'Royal Enfield Himalayan / Scram with fuel & riding gears',
      'Backup support vehicle with certified mechanic & spares',
      'Chandratal lakeside Swiss camping & homestays',
      'MAP plan (Breakfast & Dinner daily)',
      'Lead road marshal and oxygen cylinder backup'
    ]
  },
  {
    id: 'group-spiti-delhi-summer',
    category: 'spiti-valley',
    seasonType: 'summer',
    title: 'Spiti Valley Group Trip from Delhi',
    route: 'with Chandratal Lake',
    duration: '9 Days 8 Nights',
    price: 19999,
    originalPrice: 23999,
    badge: 'Early Bird',
    secondaryBadge: 'SAVE ₹4,000',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'An unforgettable group adventure through Kinnaur into Spiti Valley: visit ancient Key Gompa, post cards from Hikkim, and enjoy lakeside stargazing at Chandratal.',
    inclusions: [
      'Delhi to Delhi comfortable Tempo Traveler',
      'Stays in Kaza, Kalpa, Tabo and Chandratal camps',
      'Inner line permits and environment development fees',
      'Breakfast and dinner included on all days',
      'Friendly trip captain & group games/bonding'
    ]
  },
  {
    id: 'group-spiti-road-summer',
    category: 'spiti-valley',
    seasonType: 'summer',
    title: 'Spiti Valley Road Trip',
    route: 'with Chandratal Lake',
    duration: '8 Days 7 Nights',
    price: 20999,
    originalPrice: 24999,
    badge: 'Early Bird',
    secondaryBadge: 'SAVE ₹4,000',
    images: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The classic Spiti road trip visiting Langza Buddha statue, Chicham Bridge (Asia highest), Key Monastery, and turquoise Chandratal Lake.',
    inclusions: [
      'Full circuit transport with experienced mountain driver',
      'Campfire night at Chandratal Lake Swiss camps',
      'Heritage homestay immersion in Kaza',
      'MAP meal plan with daily hot meals',
      'Dedicated India Tour Trip Captain'
    ]
  },
  {
    id: 'group-kashmir-summer',
    category: 'kashmir',
    seasonType: 'summer',
    title: 'Kashmir Group Trip',
    route: 'with Gulmarg & Sonmarg',
    duration: '6 Days 5 Nights',
    price: 21999,
    originalPrice: 25999,
    badge: 'SAVE ₹4,000',
    secondaryBadge: null,
    images: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Lush green summer in Paradise: Dal Lake Shikara ride, flower meadows in Gulmarg, pine-fringed valleys in Pahalgam, and Thajiwas Glacier in Sonamarg.',
    inclusions: [
      '1 Night stay in traditional carved houseboat on Dal Lake',
      'Sunset Shikara ride included',
      'Gulmarg Gondola & Pahalgam Betaab Valley excursion',
      'Centrally located 3-star/4-star deluxe hotels',
      'Warm group tour captain and airport pickup/drop'
    ]
  },
  {
    id: 'group-kashmir-delhi-summer',
    category: 'kashmir',
    seasonType: 'summer',
    title: 'Kashmir Group Trip from Delhi',
    route: 'with Gulmarg & Sonmarg',
    duration: '8 Days 7 Nights',
    price: 26999,
    originalPrice: 30999,
    badge: 'SAVE ₹4,000',
    secondaryBadge: null,
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Complete Delhi-to-Delhi group voyage across Kashmir valleys: explore Srinagar Mughal Gardens, Gulmarg meadows, and Lidder river in Pahalgam.',
    inclusions: [
      'Delhi to Srinagar roundtrip transport included',
      'Deluxe hotels & Dal Lake luxury houseboat stay',
      'Gulmarg, Sonamarg & Pahalgam full day sightseeing',
      'Daily breakfast & dinner (Buffet plan)',
      'Trip leader assistance throughout the journey'
    ]
  },
  {
    id: 'group-ladakh-ahmedabad',
    category: 'ladakh',
    seasonType: 'summer',
    title: 'Leh Ladakh Group Trip from Ahmedabad',
    route: 'with Umling La & Tso Moriri',
    duration: '11 Days 10 Nights',
    price: 36999,
    originalPrice: 40999,
    badge: 'SAVE ₹4,000',
    secondaryBadge: null,
    images: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'High-altitude adventure connecting Ahmedabad travelers with Ladakh: conquer the world highest motorable pass Umling La (19,024 ft), Nubra Valley, and Pangong Tso.',
    inclusions: [
      'Ahmedabad to Delhi/Leh coordination and full circuit AC vehicle',
      'Drive to Umling La highest pass & turquoise Tso Moriri lake',
      'Pangong Lake Swiss tent camping & Nubra camel safari',
      'All Inner Line Permits and environmental fees included',
      'Experienced mountain leader and medical oxygen cylinders'
    ]
  },
  {
    id: 'group-ladakh-delhi',
    category: 'ladakh',
    seasonType: 'summer',
    title: 'Leh Ladakh Group Trip from Delhi',
    route: 'with Umling La & Tso Moriri',
    duration: '10 Days 9 Nights',
    price: 33800,
    originalPrice: 37800,
    badge: 'SAVE ₹4,000',
    secondaryBadge: null,
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The definitive Himalayan group trip from Delhi: Leh city palace, Khardung La pass, Nubra Valley sand dunes, and changing blue colors of Pangong Lake.',
    inclusions: [
      'Delhi to Leh return transport / airport transfers',
      'Deluxe hotel stays in Leh and luxury tents at Pangong',
      'Inner line permits, environmental fees and wildlife tickets',
      'Double-humped camel safari point in Hunder',
      'Certified trip captain with oxygen and safety kits'
    ]
  },
  {
    id: 'group-ladakh-bike-summer',
    category: 'ladakh',
    seasonType: 'summer',
    title: 'Leh Ladakh Bike Expedition',
    route: 'Khardung La & Nubra Valley',
    duration: '10 Days 9 Nights',
    price: 35999,
    originalPrice: 39999,
    badge: 'Early Bird',
    secondaryBadge: 'SAVE ₹4,000',
    images: [
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The bucket-list motorcycle odyssey across Ladakh: ride through Khardung La, Chang La, Hunder sand dunes, and along the banks of Pangong Lake on Royal Enfield.',
    inclusions: [
      'Royal Enfield Himalayan bike with fuel and helmet',
      'Backup support truck with mechanic, tools and spare parts',
      'Deluxe hotel and lake camp accommodations',
      'Breakfast and dinner included daily',
      'Experienced road marshal and medical backup'
    ]
  },
  {
    id: 'group-ladakh-leh',
    slug: 'leh-ladakh-group-trip',
    category: 'ladakh',
    seasonType: 'summer',
    title: 'Leh Ladakh Group Trip from Leh',
    route: 'with Nubra Valley & Pangong Tso',
    duration: '8 Days 7 Nights',
    price: 25800,
    originalPrice: 29800,
    badge: 'SAVE ₹4,000',
    secondaryBadge: 'Direct Join',
    images: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Airport-to-airport group expedition starting right in Leh: acclimatize in Leh city, traverse Khardung La pass, explore Nubra Valley sand dunes, and camp under the stars at Pangong Tso.',
    inclusions: [
      'Leh Airport pickup and drop in private vehicle',
      'Acclimatization hotel stay in Leh with heating',
      'Pangong Tso luxury lakeside camp stay & Nubra hotel',
      'Breakfast and dinner included on all days',
      'Experienced mountain trip leader and oxygen cylinders'
    ]
  }
];
