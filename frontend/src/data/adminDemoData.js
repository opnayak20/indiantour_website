/**
 * Curated fallback demo dataset for Admin Dashboard
 * Used when backend PHP server is offline on localhost or database tables are fresh.
 */
export const DEMO_DATA = {
  stats: {
    revenue_collected: 485000,
    revenue_unpaid: 62000,
    total_users: 14,
    bookings_by_status: { confirmed: 8, pending: 4, completed: 6, cancelled: 1 },
    enquiries_by_status: { new: 3, contacted: 5, in_progress: 2, converted: 4, closed: 2 }
  },
  enquiries: [
    {
      id: 101,
      name: 'Aarav Mehta',
      email: 'aarav.mehta@gmail.com',
      phone: '+91 98201 12345',
      destination: 'Golden Triangle Tour',
      date: '2026-11-15',
      travelers: 2,
      status: 'new',
      message: 'Looking for 5-star hotel upgrades in Jaipur and sunrise Taj Mahal entry.',
      created_at: '2026-10-12T10:30:00Z',
      notes: 'Initial web enquiry submitted.'
    },
    {
      id: 102,
      name: 'Ananya Sharma',
      email: 'ananya.s@outlook.com',
      phone: '+91 98112 54321',
      destination: 'Meghalaya Road Trip',
      date: '2026-11-20',
      travelers: 4,
      status: 'new',
      message: 'Interested in living root bridges trek and Dawki river boating.',
      created_at: '2026-10-13T08:15:00Z',
      notes: ''
    },
    {
      id: 103,
      name: 'Vikramaditya Rao',
      email: 'v.rao@techcorp.in',
      phone: '+91 94480 98765',
      destination: 'Winter Spiti 4x4 Expedition',
      date: '2026-12-05',
      travelers: 2,
      status: 'contacted',
      message: 'Corporate couple looking for snow drive experience and homestays.',
      created_at: '2026-10-11T14:20:00Z',
      notes: 'Called on Oct 12: Shared itinerary over email.'
    },
    {
      id: 104,
      name: 'Meera Nambiar',
      email: 'meera.nambiar@yahoo.com',
      phone: '+91 98450 11223',
      destination: 'Kerala Backwaters & Munnar',
      date: '2026-11-10',
      travelers: 3,
      status: 'in_progress',
      message: 'Custom houseboat required for 1 night in Alleppey.',
      created_at: '2026-10-10T11:00:00Z',
      notes: 'Custom quote sent. Awaiting advance payment.'
    },
    {
      id: 105,
      name: 'Rohan Gupta',
      email: 'rohan.gupta@gmail.com',
      phone: '+91 99100 44556',
      destination: 'Kedarnath Yatra from Delhi',
      date: '2026-10-28',
      travelers: 2,
      status: 'converted',
      message: 'Confirmed VIP helicopter pass booking.',
      created_at: '2026-10-09T09:00:00Z',
      notes: 'Converted to Booking Ref #201.'
    }
  ],
  bookings: [
    {
      id: 201,
      customer_name: 'Rohan Gupta',
      customer_email: 'rohan.gupta@gmail.com',
      customer_phone: '+91 99100 44556',
      package_name: 'Kedarnath Yatra from Delhi',
      travel_date: '2026-10-28',
      travelers: 2,
      total_price: 38000,
      booking_status: 'confirmed',
      payment_status: 'paid',
      special_requests: 'VIP darshan assistance requested.'
    },
    {
      id: 202,
      customer_name: 'Pooja Deshmukh',
      customer_email: 'pooja.d@gmail.com',
      customer_phone: '+91 98230 77889',
      package_name: 'Golden Triangle Classic Tour',
      travel_date: '2026-11-04',
      travelers: 2,
      total_price: 29998,
      booking_status: 'confirmed',
      payment_status: 'paid',
      special_requests: 'Vegetarian breakfast preference.'
    },
    {
      id: 203,
      customer_name: 'Dr. Siddharth Sen',
      customer_email: 'siddharth.sen@apollo.com',
      customer_phone: '+91 98300 23456',
      package_name: 'Winter Spiti Road Trip',
      travel_date: '2026-11-18',
      travelers: 1,
      total_price: 24500,
      booking_status: 'confirmed',
      payment_status: 'partial',
      special_requests: 'Window seat in 4x4 vehicle.'
    },
    {
      id: 204,
      customer_name: 'Kavita Joshi',
      customer_email: 'kavita.j@gmail.com',
      customer_phone: '+91 97110 88990',
      package_name: 'Meghalaya Backpacking Trip',
      travel_date: '2026-11-25',
      travelers: 3,
      total_price: 52500,
      booking_status: 'pending',
      payment_status: 'unpaid',
      special_requests: 'Awaiting ID verification.'
    }
  ],
  packages: [
    {
      id: 'golden-triangle-classic',
      title: 'Golden Triangle Classic Tour',
      duration: '6 Days / 5 Nights',
      location: 'Delhi - Agra - Jaipur',
      price: 14999,
      original_price: 19999,
      category: 'Golden Triangle',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviews_count: 142
    },
    {
      id: 'meghalaya-backpacking',
      title: 'Meghalaya Backpacking Adventure',
      duration: '6 Days / 5 Nights',
      location: 'Shillong - Cherrapunji - Dawki',
      price: 17500,
      original_price: 22000,
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviews_count: 89
    },
    {
      id: 'spiti-valley-winter-expedition',
      title: 'Winter Spiti 4x4 Road Trip',
      duration: '8 Days / 7 Nights',
      location: 'Shimla - Kaza - Hikkim - Kalpa',
      price: 24500,
      original_price: 29999,
      category: 'Mountain',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviews_count: 110
    },
    {
      id: 'kedarnath-delhi-departure',
      title: 'Kedarnath Yatra (Ex-Delhi)',
      duration: '5 Days / 4 Nights',
      location: 'Delhi - Haridwar - Guptkashi - Kedarnath',
      price: 18999,
      original_price: 23500,
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviews_count: 215
    },
    {
      id: 'royal-rajasthan-heritage',
      title: 'Royal Rajasthan Heritage Circuit',
      duration: '7 Days / 6 Nights',
      location: 'Jaipur - Jodhpur - Udaipur',
      price: 21999,
      original_price: 27999,
      category: 'Rajasthan',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviews_count: 98
    },
    {
      id: 'kerala-backwaters-munnar',
      title: 'Kerala Enchanting Backwaters & Hills',
      duration: '5 Days / 4 Nights',
      location: 'Cochin - Munnar - Thekkady - Alleppey',
      price: 16500,
      original_price: 21000,
      category: 'Kerala',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviews_count: 130
    }
  ],
  destinations: [
    {
      id: 'jaipur-rajasthan',
      name: 'Jaipur',
      state: 'Rajasthan',
      type: 'Heritage',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      description: 'The Pink City famous for Hawa Mahal, Amer Fort, and vibrant bazaars.',
      best_time: 'October to March'
    },
    {
      id: 'agra-uttar-pradesh',
      name: 'Agra',
      state: 'Uttar Pradesh',
      type: 'Heritage',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      description: 'Home to the magnificent Taj Mahal and historical Agra Fort along the Yamuna river.',
      best_time: 'October to March'
    },
    {
      id: 'meghalaya-northeast',
      name: 'Meghalaya',
      state: 'Meghalaya',
      type: 'Nature',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      description: 'Abode of clouds with living root bridges, crystal clear rivers, and roaring waterfalls.',
      best_time: 'September to May'
    },
    {
      id: 'spiti-himachal-pradesh',
      name: 'Spiti Valley',
      state: 'Himachal Pradesh',
      type: 'Mountain',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      description: 'High altitude cold desert featuring ancient monasteries and moonscapes.',
      best_time: 'May to October'
    },
    {
      id: 'munnar-kerala',
      name: 'Munnar',
      state: 'Kerala',
      type: 'Nature',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      description: 'Rolling tea plantations, misty mountains, and serene South Indian hill station charms.',
      best_time: 'September to March'
    },
    {
      id: 'varanasi-uttar-pradesh',
      name: 'Varanasi',
      state: 'Uttar Pradesh',
      type: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      description: 'One of the world oldest living cities renowned for Ganga Aarti and sacred ghats.',
      best_time: 'November to February'
    }
  ],
  testimonials: [
    {
      id: 1,
      name: 'Sunil Kulkarni',
      location: 'Pune',
      rating: 5,
      comment: 'The Golden Triangle trip was impeccably organized! Our driver was very polite, hotels were luxurious, and Taj Mahal at dawn was magical.',
      trip: 'Golden Triangle Classic',
      avatar: '',
      is_active: 1
    },
    {
      id: 2,
      name: 'Natasha Verma',
      location: 'Delhi',
      rating: 5,
      comment: 'Spiti in winter was a dream come true! Local homestays and the 4x4 convoy made an extreme adventure feel totally safe and warm.',
      trip: 'Winter Spiti 4x4',
      avatar: '',
      is_active: 1
    },
    {
      id: 3,
      name: 'Aditya & Ritu Roy',
      location: 'Bengaluru',
      rating: 5,
      comment: 'Meghalaya was beyond words! The double-decker root bridge trek and Dawki boating were unforgettable highlights. Highly recommended!',
      trip: 'Meghalaya Backpacking',
      avatar: '',
      is_active: 1
    }
  ],
  users: [
    {
      id: 1,
      name: 'Administrator',
      email: 'admin@indiatour.com',
      phone: '+91 98765 43210',
      role: 'admin',
      created_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Sanjay Rawat (Agent)',
      email: 'sanjay.travels@indiatour.com',
      phone: '+91 98101 22334',
      role: 'agent',
      created_at: '2026-02-15T00:00:00Z'
    },
    {
      id: 3,
      name: 'Aarav Mehta',
      email: 'aarav.mehta@gmail.com',
      phone: '+91 98201 12345',
      role: 'user',
      created_at: '2026-10-12T10:30:00Z'
    },
    {
      id: 4,
      name: 'Rohan Gupta',
      email: 'rohan.gupta@gmail.com',
      phone: '+91 99100 44556',
      role: 'user',
      created_at: '2026-10-09T09:00:00Z'
    }
  ]
};

export default DEMO_DATA;
