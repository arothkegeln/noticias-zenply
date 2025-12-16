"use client";

import { useEffect, useState, useCallback } from 'react';
import { useConfig } from '@/hooks/use-config';
import { NewsFeed } from '@/components/news-feed';
import { NewsItem } from '@/types';

export default function Dashboard() {
  const { config, loaded, addActor, hideNews } = useConfig();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Helper to enrich news (common logic)
  const enrichNewsWithActors = useCallback((rawNews: NewsItem[], actors: any[]) => {
    return rawNews.map((item: NewsItem) => {
      const matchedIds = actors
        .filter(actor => {
          // Robust check for null content
          const textToCheck = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
          return actor.keywords.some((k: string) => textToCheck.includes(k.toLowerCase()));
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((actor: any) => actor.id);

      return { ...item, matchedActorIds: matchedIds };
    });
  }, []);

  const fetchNews = useCallback(async (refresh = false) => {
    if (config.sources.length === 0) {
      setNews([]);
      return;
    }

    if (refresh) {
      setLoading(true);
      // Reset pagination if needed, but we rely on cursor mostly
    }

    try {
      // 1. FAST LOAD: Fetch from DB (GET)
      const params = new URLSearchParams({
        limit: '20',
        cursor: refresh ? '' : (news.length > 0 ? news[news.length - 1].id : '')
      });

      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();

      if (data.news && data.news.length > 0) {
        const enriched = enrichNewsWithActors(data.news, config.actors);

        if (refresh) {
          setNews(enriched);
        } else {
          setNews(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const uniqueNew = enriched.filter((n: NewsItem) => !existingIds.has(n.id));
            return [...prev, ...uniqueNew];
          });
        }
        setHasMore(data.nextCursor !== undefined);
      } else if (refresh && data.news.length === 0) {
        // DB Empty? Try to scrape immediately if it's the very first time
        setNews([]);
      }

      // 2. BACKGROUND SYNC: Trigger Scrape (POST)
      // Only trigger if we are refreshing or if list is empty
      if (refresh) {
        fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sources: config.sources }),
        }).then(async (scrapeRes) => {
          if (scrapeRes.ok) {
            const scrapeData = await scrapeRes.json();
            if (scrapeData.news) {
              const enrichedScraped = enrichNewsWithActors(scrapeData.news, config.actors);
              setNews(prev => {
                // Merge and sort
                const all = [...prev, ...enrichedScraped];
                // Dedup by ID
                const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
                return unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
              });
            }
          }
        }).catch(e => console.error("Background scrape failed", e));
      }

    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      if (refresh) setLoading(false);
    }
  }, [config.sources, config.actors, enrichNewsWithActors, news.length]); // Added dependencies

  const loadMore = async () => {
    if (!hasMore || loading) return;

    if (news.length === 0) return;

    const lastId = news[news.length - 1].id;
    try {
      const res = await fetch(`/api/news?cursor=${lastId}&limit=20`);
      const data = await res.json();

      if (data.news && data.news.length > 0) {
        const enrichedNews = enrichNewsWithActors(data.news, config.actors);

        setNews(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const uniqueNew = enrichedNews.filter((n: NewsItem) => !existingIds.has(n.id));
          return [...prev, ...uniqueNew];
        });

        if (!data.nextCursor) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more news", error);
    }
  };

  useEffect(() => {
    if (loaded) {
      // Initial load (Refresh=true to get latest DB and trigger background scrape)
      if (news.length === 0) {
        fetchNews(true);
      }
    }
  }, [loaded, fetchNews, news.length]);

  if (!loaded) return null;

  return (
    <div>
      {/* Initial Full Page Loading only if we have NO news and are loading */}
      {loading && news.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Cargando tu feed...</p>
        </div>
      )}

      {/* Feed */}
      {(!loading || news.length > 0) && (
        <NewsFeed
          news={news}
          actors={config.actors}
          loading={loading && news.length > 0} // Show refresh spinner
          onRefresh={() => fetchNews(true)}
          onAddActor={addActor}
          hiddenNewsUrls={config.hiddenNewsUrls}
          onHide={hideNews}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      )}
    </div>
  );
}
