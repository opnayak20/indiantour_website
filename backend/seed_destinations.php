<?php
// backend/seed_destinations.php
// CLI migration utility only (blocked from web access)
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(["status" => false, "message" => "Access denied: CLI execution only."]);
    exit();
}

require_once __DIR__ . '/config/database.php';

try {
    $db = (new Database())->getConnection();
    
    // Ensure table exists
    $db->exec("
        CREATE TABLE IF NOT EXISTS destinations (
            id VARCHAR(100) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            region VARCHAR(100),
            count VARCHAR(100),
            tag VARCHAR(150),
            badge VARCHAR(100),
            image TEXT,
            description TEXT,
            price VARCHAR(100) DEFAULT '₹14,999',
            priceOriginal VARCHAR(100) DEFAULT '₹18,500',
            basePriceNum INT DEFAULT 14999,
            duration VARCHAR(100) DEFAULT '5 Days / 4 Nights',
            altitude VARCHAR(100) DEFAULT 'Scenic Region',
            rating DECIMAL(3,2) DEFAULT 4.92,
            reviewsCount INT DEFAULT 88,
            overview TEXT,
            quickInfo TEXT,
            accommodationData TEXT,
            activities TEXT,
            itinerary TEXT,
            inclusions TEXT,
            exclusions TEXT,
            faqs TEXT,
            reviews TEXT,
            highlights TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ");

    $seedFile = __DIR__ . '/destinations_seed.json';
    if (!file_exists($seedFile)) {
        die("Seed file not found: $seedFile\n");
    }

    $destinations = json_decode(file_get_contents($seedFile), true);
    if (!is_array($destinations)) {
        die("Invalid JSON in $seedFile\n");
    }

    $inserted = 0;
    $updated = 0;

    foreach ($destinations as $d) {
        $id = $d['id'];
        $name = $d['name'] ?? '';
        $type = $d['type'] ?? 'domestic';
        $region = $d['region'] ?? '';
        $count = $d['count'] ?? '10 Trips';
        $tag = $d['tag'] ?? 'Custom Itinerary · Enquire';
        $badge = $d['badge'] ?? 'Trending';
        $image = $d['image'] ?? '';
        $description = $d['description'] ?? ("Explore scenic landscapes, cultural heritage, and curated wilderness trails in {$name}.");

        // Check if destination exists
        $stmt = $db->prepare("SELECT id, image FROM destinations WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            // Update image if existing image was empty, and maintain other fields
            if (empty($existing['image']) && !empty($image)) {
                $upd = $db->prepare("UPDATE destinations SET image = ?, name = COALESCE(NULLIF(name, ''), ?), region = COALESCE(NULLIF(region, ''), ?), count = COALESCE(NULLIF(count, ''), ?), badge = COALESCE(NULLIF(badge, ''), ?) WHERE id = ?");
                $upd->execute([$image, $name, $region, $count, $badge, $id]);
                $updated++;
            }
        } else {
            $ins = $db->prepare("
                INSERT INTO destinations (
                    id, name, type, region, count, tag, badge, image, description
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $ins->execute([$id, $name, $type, $region, $count, $tag, $badge, $image, $description]);
            $inserted++;
        }
    }

    echo "Seed completed successfully. Inserted: {$inserted}, Updated: {$updated}.\n";
} catch (Exception $e) {
    echo "Seed Error: " . $e->getMessage() . "\n";
}
