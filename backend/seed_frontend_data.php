<?php
// backend/seed_frontend_data.php
// CLI script to seed full website packages, reviews, enquiries, and bookings into the database

require_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "=== SEEDING DATABASE WITH FULL FRONTEND DATA ===\n\n";

// 1. Seed Packages
$packages = [
    [
        'id' => 'spiti-valley-bike-trip',
        'slug' => 'spiti-valley-bike-trip',
        'title' => 'Spiti Valley Bike Trip',
        'category' => 'Expedition',
        'badge' => 'Trending',
        'duration' => '8 Days 7 Nights',
        'altitude' => '14,931 ft (Kunzum Pass)',
        'difficulty' => 'Challenging',
        'location' => 'Delhi - Chitkul - Kaza - Chandratal - Manali - Delhi',
        'price' => '₹25,800',
        'priceOriginal' => '₹29,800',
        'basePriceNum' => 25800,
        'season' => 'Jun - Oct',
        'rating' => 4.95,
        'reviewsCount' => 148,
        'image' => 'https://images.unsplash.com/photo-1653844573020-71f77a0ccb8c?auto=format&fit=crop&w=800&q=80',
        'featured' => 1,
        'overview' => 'Ride through the rugged terrain of the cold desert of Spiti Valley. Experience ancient monasteries like Key and Dhankar, high-altitude passes, and pristine Chandratal Lake under a million stars.'
    ],
    [
        'id' => 'leh-ladakh-group-trip-from-delhi',
        'slug' => 'leh-ladakh-group-trip-from-delhi',
        'title' => 'Leh Ladakh Group Trip from Delhi',
        'category' => 'Himalayan Trek',
        'badge' => 'Best Seller',
        'duration' => '10 Days 9 Nights',
        'altitude' => '19,024 ft (Umling La)',
        'difficulty' => 'Moderate',
        'location' => 'Leh - Nubra - Pangong - Umling La - Tso Moriri',
        'price' => '₹33,800',
        'priceOriginal' => '₹37,800',
        'basePriceNum' => 33800,
        'season' => 'May - Sep',
        'rating' => 4.98,
        'reviewsCount' => 210,
        'image' => 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
        'featured' => 1,
        'overview' => 'Traverse the highest motorable road in the world at Umling La. Camp alongside the changing hues of Pangong Tso and spot double-humped camels in the high-altitude sand dunes of Nubra Valley.'
    ],
    [
        'id' => 'meghalaya-group-trip',
        'slug' => 'meghalaya-group-trip',
        'title' => 'Meghalaya Group Trip',
        'category' => 'Cultural Tour',
        'badge' => 'Monsoon Magic',
        'duration' => '6 Days 5 Nights',
        'altitude' => '4,869 ft (Cherrapunji)',
        'difficulty' => 'Moderate',
        'location' => 'Guwahati - Shillong - Cherrapunji - Dawki - Mawlynnong',
        'price' => '₹20,800',
        'priceOriginal' => '₹23,800',
        'basePriceNum' => 20800,
        'season' => 'All Year',
        'rating' => 4.90,
        'reviewsCount' => 95,
        'image' => 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        'featured' => 1,
        'overview' => 'Explore the Abode of Clouds: trek down to the Double Decker Living Root Bridge in Nongriat, boat on the crystal-clear waters of Umngot River in Dawki, and chase towering waterfalls.'
    ],
    [
        'id' => 'zanskar-valley-road-trip-from-delhi',
        'slug' => 'zanskar-valley-road-trip-from-delhi',
        'title' => 'Zanskar Valley Road Trip from Delhi',
        'category' => 'Expedition',
        'badge' => 'Offbeat Gem',
        'duration' => '6 Days 5 Nights',
        'altitude' => '16,040 ft (Shinku La)',
        'difficulty' => 'Challenging',
        'location' => 'Delhi - Jispa - Shinku La - Padum - Purne',
        'price' => '₹21,800',
        'priceOriginal' => '₹25,800',
        'basePriceNum' => 21800,
        'season' => 'Jun - Oct',
        'rating' => 4.92,
        'reviewsCount' => 64,
        'image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        'featured' => 1,
        'overview' => 'Discover the untouched kingdom of Zanskar. Marvel at the sacred peak of Gombo Rozhon, visit Phuktal Gompa carved into a limestone cliff, and cross majestic glacial passes.'
    ],
    [
        'id' => 'kedarnath-group-trip-from-ahmedabad',
        'slug' => 'kedarnath-group-trip-from-ahmedabad',
        'title' => 'Kedarnath Group Trip from Ahmedabad',
        'category' => 'Himalayan Trek',
        'badge' => 'Spiritual Journey',
        'duration' => '9 Days 8 Nights',
        'altitude' => '11,755 ft (Kedarnath Temple)',
        'difficulty' => 'Moderate',
        'location' => 'Ahmedabad - Haridwar - Guptkashi - Kedarnath - Chopta - Rishikesh',
        'price' => '₹21,800',
        'priceOriginal' => '₹24,800',
        'basePriceNum' => 21800,
        'season' => 'May - Oct',
        'rating' => 4.97,
        'reviewsCount' => 312,
        'image' => 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
        'featured' => 1,
        'overview' => 'Complete pilgrimage to Kedarnath Jyotirlinga combined with the mini-Switzerland of India, Chopta, and the highest Shiva shrine at Tungnath with Chandrashila summit views.'
    ],
    [
        'id' => 'honeymoon-in-bali',
        'slug' => 'honeymoon-in-bali',
        'title' => 'Honeymoon in Bali',
        'category' => 'International Trip',
        'badge' => 'Luxury Villa',
        'duration' => '7 Days 6 Nights',
        'altitude' => 'Sea Level',
        'difficulty' => 'Easy',
        'location' => 'Kuta - Ubud - Nusa Penida - Seminyak',
        'price' => '₹75,800',
        'priceOriginal' => '₹81,800',
        'basePriceNum' => 75800,
        'season' => 'All Year',
        'rating' => 4.99,
        'reviewsCount' => 125,
        'image' => 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        'featured' => 0,
        'overview' => 'Romantic getaway featuring floating breakfasts, private pool villa stays, cliff-edge sunsets at Uluwatu, and iconic photo spots at Nusa Penida Kelingking beach.'
    ],
    [
        'id' => 'magical-vietnam-with-phu-quoc',
        'slug' => 'magical-vietnam-with-phu-quoc',
        'title' => 'Magical Vietnam with Phu Quoc',
        'category' => 'International Trip',
        'badge' => 'Trending Overseas',
        'duration' => '7 Days 6 Nights',
        'altitude' => 'Sea Level',
        'difficulty' => 'Easy',
        'location' => 'Hanoi - Halong Bay Cruise - Da Nang - Phu Quoc',
        'price' => '₹43,800',
        'priceOriginal' => '₹47,800',
        'basePriceNum' => 43800,
        'season' => 'Oct - Apr',
        'rating' => 4.91,
        'reviewsCount' => 88,
        'image' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        'featured' => 0,
        'overview' => 'Emerald waters of Ha Long Bay overnight cruise, the Golden Bridge held by giant stone hands in Ba Na Hills, and pristine tropical beaches on Phu Quoc island.'
    ],
    [
        'id' => 'goa-tour-package',
        'slug' => 'goa-tour-package',
        'title' => 'Goa Beach & Coastal Explorer',
        'category' => 'Weekend Getaway',
        'badge' => 'Quick Escape',
        'duration' => '4 Days 3 Nights',
        'altitude' => 'Sea Level',
        'difficulty' => 'Easy',
        'location' => 'North & South Goa - Baga - Candolim - Old Goa',
        'price' => '₹7,900',
        'priceOriginal' => '₹9,900',
        'basePriceNum' => 7900,
        'season' => 'Oct - May',
        'rating' => 4.88,
        'reviewsCount' => 175,
        'image' => 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        'featured' => 0,
        'overview' => 'Sun, sand, Portuguese heritage churches, lively beach shacks, water sports at Calangute, and serene sunset catamaran cruises on the Mandovi River.'
    ],
    [
        'id' => 'spiti-valley-road-trip',
        'slug' => 'spiti-valley-road-trip',
        'title' => 'Spiti Valley Road Trip with Chandratal',
        'category' => 'Expedition',
        'badge' => 'Early Bird',
        'duration' => '11 Days 10 Nights',
        'altitude' => '15,059 ft (Kunzum La)',
        'difficulty' => 'Challenging',
        'location' => 'Shimla - Kalpa - Nako - Tabo - Kaza - Chandratal - Manali',
        'price' => '₹20,800',
        'priceOriginal' => '₹24,800',
        'basePriceNum' => 20800,
        'season' => 'Jun - Oct',
        'rating' => 4.94,
        'reviewsCount' => 180,
        'image' => 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        'featured' => 1,
        'overview' => 'Complete circuit road expedition via the legendary Hindustan-Tibet Highway. Visit the mummy of Gue, the 1,000-year-old Tabo Monastery, and camp near the crescent-shaped Chandratal Lake.'
    ]
];

$pkgStmt = $db->prepare("
    INSERT OR REPLACE INTO packages (
        id, slug, title, category, badge, duration, altitude, difficulty, location,
        price, priceOriginal, basePriceNum, season, rating, reviewsCount, image, overview, featured, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$now = date('Y-m-d H:i:s');
foreach ($packages as $p) {
    $pkgStmt->execute([
        $p['id'],
        $p['slug'],
        $p['title'],
        $p['category'],
        $p['badge'],
        $p['duration'],
        $p['altitude'],
        $p['difficulty'],
        $p['location'],
        $p['price'],
        $p['priceOriginal'],
        $p['basePriceNum'],
        $p['season'],
        $p['rating'],
        $p['reviewsCount'],
        $p['image'],
        $p['overview'],
        $p['featured'],
        $now
    ]);
    echo "  [+] Seeded Package: {$p['title']}\n";
}

// 2. Seed Testimonials from websiteData.js
$testimonials = [
    [
        'id' => 'testi-1',
        'name' => 'Bhumit Rabadiya',
        'from_location' => 'Surat, Gujarat',
        'trip' => 'Thailand & Phuket Explorer',
        'rating' => 5,
        'avatar' => 'BR',
        'quote' => 'Thank you for crafting a trip that perfectly matched our style and interests. Your attention to detail, airport pickups, and hotel selections made all the difference!',
        'is_active' => 1
    ],
    [
        'id' => 'testi-2',
        'name' => 'Janak Chauhan',
        'from_location' => 'Ahmedabad, Gujarat',
        'trip' => 'Spiti Valley Bike Trip',
        'rating' => 5,
        'avatar' => 'JC',
        'quote' => 'Just few weeks back I took the bike trip to Spiti Valley with India Tour and believe me I had an amazing expedition of a lifetime. Road captain and mechanic backup were top-notch.',
        'is_active' => 1
    ],
    [
        'id' => 'testi-3',
        'name' => 'Utsav Nathvani',
        'from_location' => 'Rajkot, Gujarat',
        'trip' => 'Spiti Valley Road Trip',
        'rating' => 5,
        'avatar' => 'UN',
        'quote' => 'It won\'t be wrong to say India Tour is synonymous with great mountain experiences. Outstanding arrangements, warm homestays, and transparent pricing throughout.',
        'is_active' => 1
    ],
    [
        'id' => 'testi-4',
        'name' => 'Krima Pandya',
        'from_location' => 'Vadodara, Gujarat',
        'trip' => 'Leh-Ladakh Overland Journey',
        'rating' => 5,
        'avatar' => 'KP',
        'quote' => 'Highly recommended for tour booking! Everything was smoothly organized. We had a great time crossing Khardung La and camping at Pangong Tso. The team was extremely supportive.',
        'is_active' => 1
    ],
    [
        'id' => 'testi-5',
        'name' => 'Dhruv Patel',
        'from_location' => 'Mumbai, Maharashtra',
        'trip' => 'Zanskar Valley Expedition',
        'rating' => 5,
        'avatar' => 'DP',
        'quote' => 'I recently had an amazing trip to Zanskar with India Tour, and it was truly unforgettable. From inquiry on WhatsApp to the final drop-off, the service was flawless.',
        'is_active' => 1
    ]
];

$testiStmt = $db->prepare("
    INSERT OR REPLACE INTO testimonials (id, name, from_location, trip, rating, avatar, quote, is_active, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");
foreach ($testimonials as $t) {
    $testiStmt->execute([
        $t['id'],
        $t['name'],
        $t['from_location'],
        $t['trip'],
        $t['rating'],
        $t['avatar'],
        $t['quote'],
        $t['is_active'],
        $now
    ]);
    echo "  [+] Seeded Review: {$t['name']} ({$t['trip']})\n";
}

// 3. Seed Realistic Customer Enquiries
$enquiries = [
    [
        'name' => 'Hardik Shah',
        'email' => 'hardik.shah@gmail.com',
        'phone' => '+91 98250 11223',
        'destination' => 'Kedarnath Group Trip from Ahmedabad',
        'travelers' => 4,
        'date' => '2026-10-25',
        'message' => 'Interested in 4 seats for Diwali batch. Need senior citizen support if possible.',
        'status' => 'new',
        'notes' => '[Initial Inquiry via Website]: Requested Diwali departure dates.'
    ],
    [
        'name' => 'Pooja Mehta',
        'email' => 'pooja.mehta92@yahoo.com',
        'phone' => '+91 97240 55667',
        'destination' => 'Spiti Valley Bike Trip',
        'travelers' => 2,
        'date' => '2026-11-05',
        'message' => 'Looking for dual-rider package on Himalayan 450 bike. Please share inclusions.',
        'status' => 'contacted',
        'notes' => "[2026-10-12 - Admin]: Shared PDF itinerary on WhatsApp. Awaiting confirmation."
    ],
    [
        'name' => 'Aditya Sharma',
        'email' => 'aditya.sharma@outlook.com',
        'phone' => '+91 99099 33445',
        'destination' => 'Leh Ladakh Group Trip from Delhi',
        'travelers' => 3,
        'date' => '2026-10-28',
        'message' => 'Group of 3 friends from Delhi. Want to confirm flight arrival in Leh.',
        'status' => 'in_progress',
        'notes' => "[2026-10-12 - Admin]: Advance payment link sent for 3 pax."
    ],
    [
        'name' => 'Bhavin Patel',
        'email' => 'bhavin.patel@gmail.com',
        'phone' => '+91 98790 88990',
        'destination' => 'Honeymoon in Bali',
        'travelers' => 2,
        'date' => '2026-11-15',
        'message' => 'Honeymoon package with private pool villa and floating breakfast.',
        'status' => 'converted',
        'notes' => "[2026-10-12 - Admin]: Converted to Booking #1. 50% advance received via NEFT."
    ],
    [
        'name' => 'Siddharth Dave',
        'email' => 'sid.dave@gmail.com',
        'phone' => '+91 94260 77112',
        'destination' => 'Meghalaya Group Trip',
        'travelers' => 1,
        'date' => '2026-12-01',
        'message' => 'Solo female/male group compatibility. Need Guwahati pickup info.',
        'status' => 'new',
        'notes' => null
    ]
];

$enqStmt = $db->prepare("
    INSERT INTO enquiries (name, email, phone, destination, travelers, date, message, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
foreach ($enquiries as $enq) {
    $enqStmt->execute([
        $enq['name'],
        $enq['email'],
        $enq['phone'],
        $enq['destination'],
        $enq['travelers'],
        $enq['date'],
        $enq['message'],
        $enq['status'],
        $enq['notes'],
        $now,
        $now
    ]);
    echo "  [+] Seeded Enquiry: {$enq['name']} ({$enq['destination']})\n";
}

echo "\nSEEDING COMPLETE! Database is now fully populated with active website content.\n";
