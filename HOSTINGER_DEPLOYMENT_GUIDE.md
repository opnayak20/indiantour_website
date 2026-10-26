# Hostinger Deployment Guide

This guide walks you through deploying the **India Tour Website** (React Frontend + PHP/MySQL Backend) to your Hostinger domain:
**`https://indiatourismlive.com`** (or temporary: `https://antiquewhite-seal-759506.hostingersite.com`)

---

## 1. Database Configuration (Configured)

The following MySQL database credentials have been configured across [backend/.env](file:///c:/Users/ASUS/Desktop/Qubnix%20Technology/indiantour_website-main/backend/.env), [backend/config/database.php](file:///c:/Users/ASUS/Desktop/Qubnix%20Technology/indiantour_website-main/backend/config/database.php), and [.env](file:///c:/Users/ASUS/Desktop/Qubnix%20Technology/indiantour_website-main/.env):

| Setting | Value |
| :--- | :--- |
| **Database Host** | `localhost` |
| **Database Name** | `u276796116_india_tour` |
| **Database User** | `u276796116_india_tour` |
| **Database Password** | `Qubnix@123` |
| **Deployment Domain** | `indiatourismlive.com` |

---

## 2. Import Database Schema (phpMyAdmin)

1. Log in to your **Hostinger hPanel**.
2. Navigate to **Databases** > **phpMyAdmin** and click **Enter phpMyAdmin** next to `u276796116_india_tour`.
3. Click on the **Import** tab at the top.
4. Select and upload [backend/schema.sql](file:///c:/Users/ASUS/Desktop/Qubnix%20Technology/indiantour_website-main/backend/schema.sql) (or from `hostinger_deploy/schema.sql`).
5. Click **Go** / **Import**.
6. This will create all tables (`users`, `destinations`, `packages`, `enquiries`, `bookings`, `testimonials`, `email_otps`, `auth_throttle`) and seed the default administrator.

> *Note: If you don't manually import `schema.sql`, the PHP backend is also coded to automatically execute table migrations on first access.*

---

## 3. Deploy Files via Hostinger File Manager (1-Click Extract)

A ready-to-deploy archive has been built:
📁 **`deploy_hostinger.zip`** (located at the root of this project)

### Step-by-Step Upload:
1. In Hostinger hPanel, go to **Websites** > **indiatourismlive.com** > **File Manager**.
2. Open the **`public_html`** folder.
3. **Important**: Delete any old extracted files or files containing backslashes in their names (select all -> Delete, or clean `public_html`).
4. Click the **Upload** button at the top right and upload the newly generated **`deploy_hostinger.zip`**.
5. Right-click **`deploy_hostinger.zip`** in File Manager and select **Extract**.
   - Choose `public_html` as the target directory.
6. Verify that your `public_html` directory contains clean folders:
   - `index.html` (React entry point)
   - `.htaccess` (SPA routing, modern MIME types, & API rewrite rule)
   - `assets/` (Folder containing Vite JS & CSS bundles)
   - `icons/` (Folder containing category SVG vector icons)
   - `fonts/` (Folder containing custom web fonts)
   - `backend/` (PHP backend with `.env`, `config/`, `helpers/`)
   - `api/` (API endpoints accessible at `/api/*`)
7. Delete the uploaded `.zip` file from `public_html` to save storage.

---

## 4. Test & Verify the Live Website

Open your browser and navigate to:
👉 **`https://antiquewhite-seal-759506.hostingersite.com`**

### What to check:
1. **Uppermost Notification Bar**: Dynamic rotating messages with character-stagger entrance and diagonal double-beam shine sweep.
2. **Category Slider**: Landmark vector SVG icons scrollable horizontally.
3. **Hero & Carousels**: Trending trips, International & Domestic carousels with 3D tilt review cards.
4. **Mobile Responsiveness**: Test on mobile screen or browser DevTools (iPhone / Android viewports) — 0 horizontal scroll overflow.
5. **Backend API Health Check**:
   - Visit: `https://antiquewhite-seal-759506.hostingersite.com/backend/index.php` or `https://antiquewhite-seal-759506.hostingersite.com/api/admin/stats.php`
   - Should return JSON response: `{"status": true, ...}`
6. **Admin Dashboard**:
   - Click the **Admin** link in the Navbar / dropdown.
   - Login with:
     - **Email**: `admin@indiatour.com`
     - **Password**: `Admin@123`

---

## 5. Rebuilding for Future Updates

Whenever you make further modifications to the project, run one command in terminal:
```bash
npm run pack:hostinger
```
This will automatically rebuild the Vite production bundle, copy the PHP backend, update configurations, and produce a fresh `deploy_hostinger.zip`.
