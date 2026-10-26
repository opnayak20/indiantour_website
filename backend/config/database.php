<?php
// backend/config/database.php

class Database {
    public $conn;

    public function getConnection() {
        $this->conn = null;

        // 1. Lightweight .env loader if environment variables are not populated
        $envFile = __DIR__ . '/../.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#')) continue;
                if (strpos($line, '=') !== false) {
                    list($key, $val) = explode('=', $line, 2);
                    $key = trim($key);
                    $val = trim($val, " \t\n\r\0\x0B\"'");
                    if (getenv($key) === false) {
                        putenv("{$key}={$val}");
                        $_ENV[$key] = $val;
                        $_SERVER[$key] = $val;
                    }
                }
            }
        }

        // 2. Strict environment resolution (no hardcoded credentials)
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $db_name = getenv('DB_NAME') ?: '';
        $username = getenv('DB_USER') ?: '';
        $password = getenv('DB_PASS') ?: '';
        $appEnv = strtolower(getenv('APP_ENV') ?: 'production');
        $explicitDriver = strtolower(getenv('DB_DRIVER') ?: '');

        // Determine if MySQL should be attempted
        $shouldAttemptMySQL = false;
        if ($explicitDriver === 'mysql') {
            $shouldAttemptMySQL = true;
        } elseif ($explicitDriver === 'sqlite') {
            $shouldAttemptMySQL = false;
        } elseif ($appEnv !== 'local') {
            // Production environment must use configured database
            $shouldAttemptMySQL = true;
        } else {
            // Local dev: probe MySQL port 3306 before attempting
            if (!empty($db_name) && !empty($username)) {
                $fp = @fsockopen("127.0.0.1", 3306, $errno, $errstr, 0.05);
                if ($fp) {
                    $shouldAttemptMySQL = true;
                    fclose($fp);
                }
            }
        }

        // 3. MySQL Connection Attempt
        if ($shouldAttemptMySQL) {
            try {
                $dsn = "mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8mb4";
                $this->conn = new PDO($dsn, $username, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_TIMEOUT => 2
                ]);

                $this->ensureMySQLTables();
                return $this->conn;
            } catch (PDOException $e) {
                // Issue #8: On production, NEVER silently fall back to SQLite to avoid data divergence
                if ($appEnv !== 'local' && $explicitDriver !== 'sqlite') {
                    error_log("Database connection error (production): " . $e->getMessage());
                    http_response_code(503);
                    header('Content-Type: application/json; charset=UTF-8');
                    echo json_encode([
                        "status" => false,
                        "message" => "Database Service Unavailable. Please contact administration."
                    ], JSON_UNESCAPED_SLASHES);
                    exit();
                }
                // In local development, fall through to SQLite fallback below
            }
        }

        // 4. Local Development Fallback: SQLite
        $sqliteDir = __DIR__ . '/../data';
        if (!is_dir($sqliteDir)) {
            @mkdir($sqliteDir, 0777, true);
        }
        $sqlitePath = $sqliteDir . '/database.sqlite';

        try {
            $this->conn = new PDO("sqlite:" . $sqlitePath, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);

            $this->ensureSQLiteTables();
            return $this->conn;
        } catch (Exception $sqliteErr) {
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode([
                "status" => false,
                "message" => "Database Connection Failed: " . $sqliteErr->getMessage()
            ], JSON_UNESCAPED_SLASHES);
            exit();
        }
    }

    private function ensureMySQLTables() {
        $schema = "
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

            CREATE TABLE IF NOT EXISTS `email_otps` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `email` VARCHAR(150) NOT NULL,
              `otp` VARCHAR(10) NOT NULL,
              `expires_at` DATETIME NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              INDEX (`email`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `auth_throttle` (
              `id` VARCHAR(64) PRIMARY KEY,
              `action_type` VARCHAR(32) NOT NULL,
              `identifier` VARCHAR(150) NOT NULL,
              `attempts` INT DEFAULT 1,
              `created_at` DATETIME NOT NULL,
              `updated_at` DATETIME NOT NULL,
              INDEX (`action_type`, `identifier`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `destinations` (
              `id` VARCHAR(100) PRIMARY KEY,
              `name` VARCHAR(255) NOT NULL,
              `type` VARCHAR(50) NOT NULL,
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

            CREATE TABLE IF NOT EXISTS `settings` (
              `setting_key` VARCHAR(100) PRIMARY KEY,
              `setting_value` LONGTEXT NOT NULL,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        $this->conn->exec($schema);

        // Auto-seed default Administrator account if not present
        try {
            $adminCheck = $this->conn->prepare("SELECT id FROM `users` WHERE `email` = ? LIMIT 1");
            $adminCheck->execute(['admin@indiatour.com']);
            if (!$adminCheck->fetch()) {
                $hash = password_hash('Admin@123', PASSWORD_BCRYPT);
                $insAdmin = $this->conn->prepare("
                    INSERT INTO `users` (`name`, `email`, `password`, `phone`, `role`, `is_verified`, `address`, `created_at`, `updated_at`)
                    VALUES ('India Tour Admin', 'admin@indiatour.com', ?, '+91-9876543210', 'admin', 1, 'Ahmedabad HQ', NOW(), NOW())
                ");
                $insAdmin->execute([$hash]);
            }
        } catch (Exception $e) {
            // Non-blocking
        }
    }

    private function ensureSQLiteTables() {
        $schema = "
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL,
              phone TEXT DEFAULT NULL,
              role TEXT DEFAULT 'user',
              is_verified INTEGER DEFAULT 1,
              avatar TEXT DEFAULT NULL,
              address TEXT DEFAULT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS email_otps (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              email TEXT NOT NULL,
              otp TEXT NOT NULL,
              expires_at DATETIME NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS enquiries (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER DEFAULT NULL,
              name TEXT NOT NULL,
              email TEXT NOT NULL,
              phone TEXT NOT NULL,
              destination TEXT NOT NULL,
              travelers INTEGER DEFAULT 1,
              date TEXT DEFAULT NULL,
              message TEXT DEFAULT NULL,
              status TEXT DEFAULT 'new',
              notes TEXT DEFAULT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS bookings (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              package_name TEXT NOT NULL,
              travel_date TEXT NOT NULL,
              travelers INTEGER DEFAULT 1,
              total_price REAL DEFAULT 0.00,
              booking_status TEXT DEFAULT 'pending',
              payment_status TEXT DEFAULT 'unpaid',
              special_requests TEXT DEFAULT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS auth_throttle (
              id VARCHAR(64) PRIMARY KEY,
              action_type VARCHAR(32) NOT NULL,
              identifier VARCHAR(150) NOT NULL,
              attempts INT DEFAULT 1,
              created_at DATETIME NOT NULL,
              updated_at DATETIME NOT NULL
            );

            CREATE TABLE IF NOT EXISTS destinations (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              type TEXT NOT NULL,
              region TEXT DEFAULT NULL,
              count TEXT DEFAULT NULL,
              tag TEXT DEFAULT NULL,
              badge TEXT DEFAULT NULL,
              image TEXT DEFAULT NULL,
              description TEXT DEFAULT NULL,
              price TEXT DEFAULT '₹14,999',
              priceOriginal TEXT DEFAULT '₹18,500',
              basePriceNum INTEGER DEFAULT 14999,
              duration TEXT DEFAULT '5 Days / 4 Nights',
              altitude TEXT DEFAULT 'Scenic Region',
              rating REAL DEFAULT 4.92,
              reviewsCount INTEGER DEFAULT 88,
              overview TEXT DEFAULT NULL,
              quickInfo TEXT DEFAULT NULL,
              accommodationData TEXT DEFAULT NULL,
              activities TEXT DEFAULT NULL,
              itinerary TEXT DEFAULT NULL,
              inclusions TEXT DEFAULT NULL,
              exclusions TEXT DEFAULT NULL,
              faqs TEXT DEFAULT NULL,
              reviews TEXT DEFAULT NULL,
              highlights TEXT DEFAULT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS packages (
              id TEXT PRIMARY KEY,
              slug TEXT DEFAULT NULL,
              title TEXT NOT NULL,
              category TEXT DEFAULT NULL,
              badge TEXT DEFAULT NULL,
              duration TEXT DEFAULT NULL,
              altitude TEXT DEFAULT NULL,
              difficulty TEXT DEFAULT NULL,
              location TEXT DEFAULT NULL,
              price TEXT DEFAULT NULL,
              priceOriginal TEXT DEFAULT NULL,
              basePriceNum INTEGER DEFAULT 0,
              pricePerPerson TEXT DEFAULT NULL,
              season TEXT DEFAULT NULL,
              rating REAL DEFAULT 4.90,
              reviewsCount INTEGER DEFAULT 120,
              image TEXT DEFAULT NULL,
              gallery TEXT DEFAULT NULL,
              overview TEXT DEFAULT NULL,
              featured INTEGER DEFAULT 0,
              quickInfo TEXT DEFAULT NULL,
              accommodationData TEXT DEFAULT NULL,
              activities TEXT DEFAULT NULL,
              itinerary TEXT DEFAULT NULL,
              inclusions TEXT DEFAULT NULL,
              exclusions TEXT DEFAULT NULL,
              faqs TEXT DEFAULT NULL,
              reviews TEXT DEFAULT NULL,
              highlights TEXT DEFAULT NULL,
              batches TEXT DEFAULT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS testimonials (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              from_location TEXT DEFAULT NULL,
              trip TEXT DEFAULT NULL,
              rating INTEGER DEFAULT 5,
              avatar TEXT DEFAULT NULL,
              quote TEXT DEFAULT NULL,
              is_active INTEGER DEFAULT 1,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS settings (
              setting_key TEXT PRIMARY KEY,
              setting_value TEXT NOT NULL,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ";
        $this->conn->exec($schema);

        // Auto-seed default Administrator account in SQLite if not present
        try {
            $adminCheck = $this->conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
            $adminCheck->execute(['admin@indiatour.com']);
            if (!$adminCheck->fetch()) {
                $hash = password_hash('Admin@123', PASSWORD_BCRYPT);
                $insAdmin = $this->conn->prepare("
                    INSERT INTO users (name, email, password, phone, role, is_verified, address, created_at, updated_at)
                    VALUES ('India Tour Admin', 'admin@indiatour.com', ?, '+91-9876543210', 'admin', 1, 'Ahmedabad HQ', datetime('now'), datetime('now'))
                ");
                $insAdmin->execute([$hash]);
            }
        } catch (Exception $e) {
            // Non-blocking
        }
    }
}
