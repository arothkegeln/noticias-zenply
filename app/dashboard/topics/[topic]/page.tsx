"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useConfig } from '@/hooks/use-config';
import { NewsFeed } from '@/components/news-feed';
import { NewsItem } from '@/types';
import { normalizeText } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function TopicPage() {
    const params = useParams();
    const topic = decodeURIComponent(params.topic as string);
    const { config, loaded, addActor, hideNews } = useConfig();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNews = useCallback(async () => {
        if (!config.sources || config.sources.length === 0) {
            setNews([]);
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
                // Client-side filtering for the topic
                const topicNormalized = normalizeText(topic);

                // Find if this topic corresponds to a configured actor
                const relevantActor = config.actors.find(a => normalizeText(a.name) === topicNormalized);

                // Get keywords from actor or just use the topic itself
                const searchKeywords = relevantActor
                    ? [relevantActor.name, ...relevantActor.keywords].map(normalizeText)
                    : [topicNormalized];

                const filtered = data.news.filter((item: NewsItem) => {
                    const titleNormalized = normalizeText(item.title);
                    const contentNormalized = normalizeText(item.contentSnippet || '');

                    // Check text matches (Title OR Content)
                    const textMatch = searchKeywords.some(keyword =>
                        titleNormalized.includes(keyword) || contentNormalized.includes(keyword)
                    );

                    // Check tags
                    const tagMatch = (item.tags || []).some(t =>
                        searchKeywords.some(keyword => normalizeText(t.text).includes(keyword))
                    );

                    // Check matched actors ID (Server-side match)
                    const idMatch = relevantActor && (item.matchedActorIds || []).includes(relevantActor.id);

                    return textMatch || tagMatch || idMatch;
                });
                setNews(filtered);
            }
        } catch (error) {
            console.error("Failed to fetch news:", error);
        } finally {
            setLoading(false);
        }
    }, [config.sources, config.actors, topic]);

    useEffect(() => {
        if (loaded) {
            fetchNews();
        }
    }, [loaded, fetchNews]);

    if (!loaded) return null;

    const isFollowed = config.actors.some(a => a.name.toLowerCase() === topic.toLowerCase());

    const handleFollow = async () => {
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        await addActor({
            name: topic,
            keywords: [topic],
            color: randomColor
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground capitalize">
                            {topic}
                        </h1>
                        <p className="text-muted-foreground">
                            Noticias relacionadas con "{topic}"
                        </p>
                    </div>
                </div>

                {!isFollowed && (
                    <button
                        onClick={handleFollow}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
                    >
                        <Plus size={18} />
                        Seguir Tema
                    </button>
                )}
            </div>

            <NewsFeed
                news={news}
                actors={config.actors}
                loading={loading}
                onRefresh={fetchNews}
                onAddActor={addActor}
                hiddenNewsUrls={config.hiddenNewsUrls}
                onHide={hideNews}
                layout="timeline"
            />
        </div>
    );
}
