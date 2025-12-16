# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start development server (Next.js)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma migrate dev --name <name>  # Create/apply migrations
npx prisma db seed                     # Seed database (creates admin@zenply.io/admin123)
npx prisma studio                      # Open Prisma database browser
```

## Architecture Overview

This is a **Next.js 16 App Router** news aggregation application with authentication.

### Core Data Flow

1. **Configuration (client-side)**: Sources and Actors are stored in localStorage via `useConfig` hook (`hooks/use-config.ts`)
2. **News Fetching**: Dashboard calls `POST /api/news` with configured sources
3. **Scraping**: API route (`app/api/news/route.ts`) fetches from RSS (via `rss-parser`) or web scraping (via `cheerio`)
4. **Actor Matching**: Client-side matching in `app/dashboard/page.tsx` enriches news items with `matchedActorIds`

### Key Concepts

- **Sources**: RSS feeds or web pages with CSS selectors (type: 'rss' | 'web')
- **Actors**: Entities (companies, people) defined by keywords for tracking/highlighting
- **Catalog**: Pre-defined media sources in `lib/catalog-data.ts` for easy addition

### Authentication

- NextAuth v5 Beta with JWT strategy
- Providers: Google OAuth + Credentials (bcrypt)
- Middleware protects `/dashboard/*` routes
- Auth config split: `auth.config.ts` (edge-compatible) + `auth.ts` (full with Prisma)

### Database

- SQLite via Prisma (`prisma/schema.prisma`)
- Models: User, Account, Session, VerificationToken (standard NextAuth schema)
- Note: News sources/actors are NOT in DB - they're client-side localStorage

### Component Structure

- `components/news-feed.tsx`: Main feed with filtering (source, actor, sort)
- `components/news-card.tsx`: Individual news item display
- `components/sidebar.tsx`: Navigation sidebar
- `components/settings/`: Source and Actor management forms

### Type Definitions

All core types in `types/index.ts`: `NewsSource`, `Actor`, `NewsItem`, `Tag`
