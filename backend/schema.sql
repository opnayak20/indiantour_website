-- India Tour Website Database Schema
-- Hostinger MySQL Database Schema
-- Database Name: u276796116_india_tour

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `is_verified` TINYINT(1) DEFAULT 1,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Email OTPs Table
CREATE TABLE IF NOT EXISTS `email_otps` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL,
  `otp` VARCHAR(10) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Inquiries Table
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(25) NOT NULL,
  `destination` VARCHAR(150) NOT NULL,
  `travelers` INT DEFAULT 1,
  `date` DATE DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `status` ENUM('new', 'contacted', 'in_progress', 'converted', 'closed') DEFAULT 'new',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `package_name` VARCHAR(200) NOT NULL,
  `travel_date` DATE NOT NULL,
  `travelers` INT NOT NULL DEFAULT 1,
  `total_price` DECIMAL(10,2) DEFAULT 0.00,
  `booking_status` ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  `payment_status` ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
  `special_requests` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Destinations Table
CREATE TABLE IF NOT EXISTS `destinations` (
  `id` VARCHAR(100) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) NOT NULL, -- 'domestic' or 'international'
  `region` VARCHAR(100) DEFAULT NULL,
  `count` VARCHAR(100) DEFAULT NULL,
  `tag` VARCHAR(150) DEFAULT NULL,
  `badge` VARCHAR(100) DEFAULT NULL,
  `image` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `price` VARCHAR(100) DEFAULT '₹14,999',
  `priceOriginal` VARCHAR(100) DEFAULT '₹18,500',
  `basePriceNum` INT DEFAULT 14999,
  `duration` VARCHAR(100) DEFAULT '5 Days / 4 Nights',
  `altitude` VARCHAR(100) DEFAULT 'Scenic Region',
  `rating` DECIMAL(3,2) DEFAULT 4.92,
  `reviewsCount` INT DEFAULT 88,
  `overview` TEXT DEFAULT NULL,
  `quickInfo` TEXT DEFAULT NULL,
  `accommodationData` TEXT DEFAULT NULL,
  `activities` TEXT DEFAULT NULL,
  `itinerary` TEXT DEFAULT NULL,
  `inclusions` TEXT DEFAULT NULL,
  `exclusions` TEXT DEFAULT NULL,
  `faqs` TEXT DEFAULT NULL,
  `reviews` TEXT DEFAULT NULL,
  `highlights` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Packages Table
CREATE TABLE IF NOT EXISTS `packages` (
  `id` VARCHAR(100) PRIMARY KEY,
  `slug` VARCHAR(100) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `badge` VARCHAR(100) DEFAULT NULL,
  `duration` VARCHAR(100) DEFAULT NULL,
  `altitude` VARCHAR(100) DEFAULT NULL,
  `difficulty` VARCHAR(100) DEFAULT NULL,
  `location` VARCHAR(200) DEFAULT NULL,
  `price` VARCHAR(100) DEFAULT NULL,
  `priceOriginal` VARCHAR(100) DEFAULT NULL,
  `basePriceNum` INT DEFAULT 0,
  `pricePerPerson` VARCHAR(100) DEFAULT NULL,
  `season` VARCHAR(100) DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT 4.90,
  `reviewsCount` INT DEFAULT 120,
  `image` TEXT DEFAULT NULL,
  `gallery` TEXT DEFAULT NULL,
  `overview` TEXT DEFAULT NULL,
  `featured` TINYINT(1) DEFAULT 0,
  `quickInfo` TEXT DEFAULT NULL,
  `accommodationData` TEXT DEFAULT NULL,
  `activities` TEXT DEFAULT NULL,
  `itinerary` TEXT DEFAULT NULL,
  `inclusions` TEXT DEFAULT NULL,
  `exclusions` TEXT DEFAULT NULL,
  `faqs` TEXT DEFAULT NULL,
  `reviews` TEXT DEFAULT NULL,
  `highlights` TEXT DEFAULT NULL,
  `batches` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Testimonials Table
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(100) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `from_location` VARCHAR(255) DEFAULT NULL,
  `trip` VARCHAR(255) DEFAULT NULL,
  `rating` INT DEFAULT 5,
  `avatar` VARCHAR(50) DEFAULT NULL,
  `quote` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Auth Rate Throttle Table (Action-based throttle & lockout)
CREATE TABLE IF NOT EXISTS `auth_throttle` (
  `id` VARCHAR(64) PRIMARY KEY,
  `action_type` VARCHAR(32) NOT NULL,
  `identifier` VARCHAR(150) NOT NULL,
  `attempts` INT DEFAULT 1,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  INDEX (`action_type`, `identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Site Settings (Key-Value storage for Lead Popup and Global Toggles)
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Default Administrator Account (admin@indiatour.com / Admin@123)
INSERT INTO `users` (`name`, `email`, `password`, `phone`, `role`, `is_verified`, `address`, `created_at`, `updated_at`)
SELECT 'India Tour Admin', 'admin@indiatour.com', '$2y$10$5Amp0MYFWomURntL0J5VYOr5v6xMb4YHFfvnu5oxJ1Tv0M8r6Dg.G', '+91-9876543210', 'admin', 1, 'Ahmedabad HQ', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `email` = 'admin@indiatour.com');

SET FOREIGN_KEY_CHECKS = 1;

