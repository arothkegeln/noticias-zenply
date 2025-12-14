"use client";

import { useEffect, useState, useCallback } from 'react';
import { useConfig } from '@/hooks/use-config';
import { NewsFeed } from '@/components/news-feed';
import { NewsItem } from '@/types';

export default function Dashboard() {
  const { config, loaded } = useConfig();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

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
        // Here we can do client-side actor matching if needed to tag them
        // For now, assume simple matching logic or just pass actors to NewsCard
        // We will perform matching here to populate matchedActorIds if the API didn't

        const enrichedNews = data.news.map((item: NewsItem) => {
          const matchedIds = config.actors
            .filter(actor => {
              const textToCheck = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
              return actor.keywords.some(k => textToCheck.includes(k.toLowerCase()));
            })
            .map(actor => actor.id);

          return { ...item, matchedActorIds: matchedIds };
        });

        // Filter: Show all, but prioritize/badge matched ones?
        // User asked "permita hacer seguimiento... siempre siguiendo a los mismmos actores"
        // Maybe we ONLY show matched news? Or highlight them?
        // "hacer seguimiento de varios siios... pero siempre siguiendo a los mismmos actores"
        // Allows tracking sites BUT focusing on actors. 
        // I will show ALL news, but if 'matchedIds' is > 0, they are highlighted.
        // OR filtering toggle? For now, show all with badging.

        setNews(enrichedNews);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [config.sources, config.actors]);

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
      />
    </div>
  );
}
