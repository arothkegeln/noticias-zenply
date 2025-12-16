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

  const fetchNews = useCallback(async () => {
    if (config.sources.length === 0) {
      setNews([]); // Limpiar noticias si no hay fuentes
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: config.sources }),
      });

      const data = await res.json();
      if (data.news) {
        // Enrich locally with matching logic
        const enrichedNews = enrichNewsWithActors(data.news, config.actors);
        setNews(enrichedNews);
        setHasMore(data.news.length === 100); // Assume more if full batch
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [config.sources, config.actors]);

  const loadMore = async () => {
    if (!hasMore || loading || news.length === 0) return;

    const lastId = news[news.length - 1].id;
    try {
      const res = await fetch(`/api/news?cursor=${lastId}&limit=50`);
      const data = await res.json();

      if (data.news && data.news.length > 0) {
        const enrichedNews = enrichNewsWithActors(data.news, config.actors);

        // Filter duplicates just in case
        setNews(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const uniqueNew = enrichedNews.filter((n: NewsItem) => !existingIds.has(n.id));
          return [...prev, ...uniqueNew];
        });

        if (data.news.length < 50) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more news", error);
    }
  };

  // Helper to enrich news (common logic)
  const enrichNewsWithActors = (rawNews: NewsItem[], actors: any[]) => {
    return rawNews.map((item: NewsItem) => {
      const matchedIds = actors
        .filter(actor => {
          const textToCheck = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
          return actor.keywords.some((k: string) => textToCheck.includes(k.toLowerCase()));
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((actor: any) => actor.id);

      return { ...item, matchedActorIds: matchedIds };
    });
  };

  useEffect(() => {
    if (loaded) {
      fetchNews(); // Ejecutar siempre para limpiar o cargar noticias
    }
  }, [loaded, config.sources, fetchNews]);

  if (!loaded) return null;

  return (
    <div>
      <NewsFeed
        news={news}
        actors={config.actors}
        loading={loading}
        onRefresh={fetchNews}
        onAddActor={addActor}
        hiddenNewsUrls={config.hiddenNewsUrls}
        onHide={hideNews}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}
