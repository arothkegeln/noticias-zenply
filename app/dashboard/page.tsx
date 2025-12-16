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

  const [loadingText, setLoadingText] = useState("Cargando noticias...");

  const fetchNews = useCallback(async () => {
    if (config.sources.length === 0) {
      setNews([]);
      return;
    }

    setLoading(true);
    setLoadingText("Buscando noticias recientes...");

    // Timer to update messages for long waits
    const timer1 = setTimeout(() => setLoadingText("Analizando contenido y extrayendo etiquetas..."), 4000);
    const timer2 = setTimeout(() => setLoadingText("Procesando gran volumen de noticias (Modo Infinito)..."), 10000);
    const timer3 = setTimeout(() => setLoadingText("Esto está tomando más de lo usual, gracias por tu paciencia..."), 25000);

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: config.sources }),
      });

      const data = await res.json();
      if (data.news) {
        const enrichedNews = enrichNewsWithActors(data.news, config.actors);
        setNews(enrichedNews);
        setHasMore(data.news.length === 500); // Check against new limit
      }
    } catch (e) {
      console.error(e);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setLoading(false);
    }
  }, [config.sources, config.actors]);

  const loadMore = async () => {
    // ... same code ...
    if (!hasMore || loading || news.length === 0) return;

    const lastId = news[news.length - 1].id;
    try {
      const res = await fetch(`/api/news?cursor=${lastId}&limit=50`);
      const data = await res.json();

      if (data.news && data.news.length > 0) {
        const enrichedNews = enrichNewsWithActors(data.news, config.actors);

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
          // Robust check for null content
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
      fetchNews();
    }
  }, [loaded, config.sources, fetchNews]);

  if (!loaded) return null;

  return (
    <div>
      {loading && news.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">{loadingText}</p>
        </div>
      )}

      {/* 
        Pass loading=false to NewsFeed if we are handling the initial spinner here to avoid double spinners, 
        OR keep it if NewsFeed handles "loading more" spinner separately.
        If news is empty, we act as full page loader above.
        If news has items, we let NewsFeed show its top/bottom loaders.
      */}
      {(!loading || news.length > 0) && (
        <NewsFeed
          news={news}
          actors={config.actors}
          loading={loading && news.length > 0} // Only show feed spinner if we have news (refreshing)
          onRefresh={fetchNews}
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
