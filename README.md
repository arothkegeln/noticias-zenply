# Noticias Zenply

News Tracking Application for decision makers. Aggregates news from RSS feeds and Web Scraping, highlighting key actors based on keywords.

## Features

-   **Modular Grid Feed**: Responsive, modern card layout for news items.
-   **Multi-Source Tracking**: Support for RSS Feeds and Web Scraping (via CSS Selectors).
-   **Actor Intelligence**: Define "Actors" (companies, people) and get visual highlights when they appear in news.
-   **Authentication**: Secure login via Google or Credentials (with local DB).
-   **Dark Mode**: Sleek, professional interface tailored for reading.
-   **Archive & History**: Persistent storage of news with infinite scroll capability.

## Tech Stack

-   **Framework**: Next.js 16 (App Router)
-   **Database**: PostgreSQL + Prisma (Hosted on Supabase/Local)
-   **Auth**: NextAuth.js (v5 Beta)
-   **Styling**: Tailwind CSS
-   **Scraping**: Cheerio + RSS Parser
-   **NLP**: Custom Keyword Extraction & Relevance Scoring

## Getting Started

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host:port/db"
AUTH_SECRET="your-secret-key-min-32-chars"
# Optional: Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 2. Install & Seed

```bash
npm install
npx prisma generate
npx prisma db push
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Technical Documentation: Scraping Strategy (For LLM Handoff)

This application uses a hybrid approach to fetch news: Standard RSS Parsing and fallback Web Scraping for sites that do not provide RSS or block it (like **Diario Financiero**).

### Core Scraping Logic (`app/api/news/route.ts`)

For sources defined as `type: 'web'` in `lib/catalog-data.ts`:

1.  **Request Spoofing**: We avoid standard bot blocking by sending a generic Browser User-Agent header.
    ```javascript
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ...',
        'Accept': 'text/html,application/xhtml+xml...'
    }
    ```

2.  **HTML Parsing**: We use `cheerio` to load the raw HTML response.

3.  **Selector Iteration**: The system does NOT scrape the whole page blindly. It iterates specifically over elements matching the `selector` defined in the catalog.
    *   **Diario Financiero (DF)** Example:
        *   **Target URL**: `https://www.df.cl`
        *   **Main Selector**: `.card__title`
        *   **Logic**:
            1.  Find all elements matching `.card__title`.
            2.  Extract text as `Title`.
            3.  Look for closest `<a>` tag (`.closest('a')`) to extract `href` as `Link`.
            4.  Look for closest article container to search for `imageSelector` (`.card__img img`) and `summarySelector` (`.card__description`).

4.  **Deep Scraping (Content Enrichment)**:
    Once the list is fetched, we run a "Deep Scrape" on the individual article URL to fetch:
    *   `og:image` (High res thumbnail)
    *   `og:description` (Full summary)
    *   `articleBody` (For NLP analysis)

5.  **Deduplication**:
    *   We use a `Set<string>` of seen URLs to prevent duplicate stories if a source lists the same article in "Featured" and "Latest" sections simultaneously.

### Entity Relevance Algorithm (`lib/keyword-extractor.ts`)

To determine if a news item mentions a relevant actor (Tag):
1.  **Scoring**:
    *   **Title Match**: +50 points (Protagonist).
    *   **Lead Match** (First 200 chars): +10 points.
    *   **Body Match**: +1 point per mention.
2.  **Threshold**: An entity is only tagged if it accumulates **>= 5 points**.
3.  **Atomization**: Prefixes like "Gira de..." or "Dichos de..." are stripped to keep tags clean (e.g., "Trump" instead of "Gira de Trump").
