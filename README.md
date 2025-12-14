# Noticias Zenply

News Tracking Application for decision makers. Aggregates news from RSS feeds and Web Scraping, highlighting key actors based on keywords.

## Features

-   **Modular Grid Feed**: Responsive, modern card layout for news items.
-   **Multi-Source Tracking**: Support for RSS Feeds and Web Scraping (via CSS Selectors).
-   **Actor Intelligence**: Define "Actors" (companies, people) and get visual highlights when they appear in news.
-   **Authentication**: Secure login via Google or Credentials (with local DB).
-   **Dark Mode**: Sleek, professional interface tailored for reading.

## Tech Stack

-   **Framework**: Next.js 16 (App Router)
-   **Database**: SQLite + Prisma
-   **Auth**: NextAuth.js (v5 Beta)
-   **Styling**: Tailwind CSS
-   **Scraping**: Cheerio + RSS Parser

## Getting Started

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-key-min-32-chars"
# Optional: Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 2. Install & Seed

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed # Creates default admin user
```

**Default Credentials:**
-   Email: `admin@zenply.io`
-   Password: `admin123`

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Configuration

-   **add Sources**: Go to Settings -> Sources. Add RSS URLs or Web Scraping targets (e.g., `https://site.com` with selector `h2 a`).
-   **Add Actors**: Go to Settings -> Actors. Add names and keywords (comma separated).
