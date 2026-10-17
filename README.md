# Indian Tour & Travel Website

Full-stack tourism website featuring a React + Vite frontend and a PHP REST API backend.

## Project Structure

```text
Indian Tour Website/
├── frontend/               # React + Vite application
│   ├── src/                # React components, pages, styles & assets
│   ├── public/             # Static public assets and logos
│   ├── index.html          # HTML entry point
│   ├── vite.config.js      # Vite build configuration
│   └── package.json        # Frontend scripts and dependencies
│
├── backend/                # PHP REST API
│   ├── api/                # API endpoints (auth, admin, enquiries, user)
│   ├── config/             # Database connection and credentials
│   ├── helpers/            # JWT, CORS, and Auth helper utilities
│   ├── schema.sql          # MySQL database schema
│   └── index.php           # Central API status & endpoint guide
│
├── package.json            # Root convenience scripts
└── README.md
```

## Getting Started

### 1. Frontend Development

You can run the frontend either from the root or inside the `frontend` folder:

```bash
# Option A: From root directory
npm run dev

# Option B: From frontend directory
cd frontend
npm run dev
```

The frontend will run at `http://localhost:5173/`.

### 2. Backend Development

Make sure you have PHP installed. You can start the PHP built-in server:

```bash
# Option A: From root directory
npm run backend

# Option B: Direct PHP command
php -S localhost:8000 -t backend
```

The backend API will run at `http://localhost:8000/`.
