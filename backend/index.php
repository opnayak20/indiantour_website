<?php
// backend/index.php - Central API Health & Info page
require_once __DIR__ . '/helpers/cors.php';

$response = [
    "status" => true,
    "service" => "India Tour - PHP REST API",
    "version" => "1.2.0",
    "message" => "Backend API is active and running successfully!",
    "endpoints" => [
        "auth" => [
            "GET|POST /api/auth.php" => "Unified Auth: session check, send_otp, verify_otp, password login",
            "POST /api/auth/send_otp.php" => "Dispatch OTP email for verification",
            "POST /api/auth/login.php" => "User / Admin Login",
            "POST /api/auth/register.php" => "User Registration",
            "GET /api/auth/me.php" => "Current Authenticated Session User"
        ],
        "user" => [
            "GET /api/user/profile.php" => "Get User Profile",
            "PUT /api/user/profile.php" => "Update User Profile",
            "GET /api/user/my_enquiries.php" => "Get User Inquiries & Bookings"
        ],
        "admin" => [
            "GET /api/admin/stats.php" => "Admin Dashboard Metrics & Statistics",
            "GET /api/admin/enquiries.php" => "List & Filter Inquiries",
            "POST /api/admin/enquiries.php" => "Update Inquiry Status & Notes",
            "GET|POST|PUT|DELETE /api/admin/bookings.php" => "Manage Bookings & Convert Enquiries",
            "GET /api/admin/users.php" => "List All Registered Users",
            "PUT|POST /api/admin/users.php" => "Update User Role (Admin Privileges)",
            "GET|POST|PUT|DELETE /api/admin/packages.php" => "Manage Travel Packages",
            "GET|POST|PUT|DELETE /api/admin/destinations.php" => "Manage Destinations",
            "GET|POST|PUT|DELETE /api/admin/testimonials.php" => "Manage Testimonials (?admin=1 for admin view)",
            "POST /api/admin/upload_image.php" => "Upload Package & Destination Images"
        ],
        "enquiries" => [
            "POST /api/enquiries/create.php" => "Submit Travel & Trek Inquiry"
        ]
    ]
];

sendResponse(200, $response, "API Server Running");
