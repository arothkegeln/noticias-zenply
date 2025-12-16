"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { NewsItem, Actor } from '@/types';
import { NewsCard } from './news-card';
import { RefreshCw, Filter } from 'lucide-react';
import { NewsCardSkeleton } from './news-card-skeleton';
import { isSameDay, format, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';

interface NewsFeedProps {
    news: NewsItem[];
    actors: Actor[];
    loading: boolean;
    onRefresh: () => void;
    onAddActor: (actor: Omit<Actor, 'id'>) => Promise<Actor | null>;
    hiddenNewsUrls?: Set<string>;
    onHide?: (newsUrl: string, newsTitle: string) => Promise<boolean>;
    layout?: 'grid' | 'timeline';
    hasMore?: boolean;
    onLoadMore?: () => void;
}

export function NewsFeed({ news, actors, loading, onRefresh, onAddActor, hiddenNewsUrls, onHide, layout = 'grid', hasMore = false, onLoadMore }: NewsFeedProps) {
    const [selectedSource, setSelectedSource] = useState<string>('all');
    const [selectedActor, setSelectedActor] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    // Infinite Scroll Observer
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
            if (onLoadMore) onLoadMore();
        }
    }, [hasMore, loading, onLoadMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "20px",
            threshold: 0
        });

        const sentinel = document.getElementById("sentinel");
        if (sentinel) observer.observe(sentinel);

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, [handleObserver, news.length]); // Re-attach when list grows

    // Get unique sources from news
    const sources = useMemo(() => {
        const uniqueSources = Array.from(new Set(news.map(item => item.sourceName)));
        return uniqueSources.sort();
    }, [news]);

    // Filter and sort news
    const filteredNews = useMemo(() => {
        let filtered = [...news];

        // Filter out hidden news
        if (hiddenNewsUrls && hiddenNewsUrls.size > 0) {
            filtered = filtered.filter(item => !hiddenNewsUrls.has(item.link));
        }

        // Filter by source
        if (selectedSource !== 'all') {
            filtered = filtered.filter(item => item.sourceName === selectedSource);
        }

        // Filter by actor
        if (selectedActor !== 'all') {
            filtered = filtered.filter(item => item.matchedActorIds.includes(selectedActor));
        }

        // Sort by date
        filtered.sort((a, b) => {
            const dateA = new Date(a.pubDate).getTime();
            const dateB = new Date(b.pubDate).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [news, selectedSource, selectedActor, sortOrder, hiddenNewsUrls]);

    // ... inside component ...

    // ... inside component ...

    if (loading && news.length === 0) {
        if (layout === 'timeline') {
            return (
                <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {/* Timeline Skeletons */}
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <span className="animate-pulse bg-muted rounded-full w-6 h-6" />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-2">
                                <NewsCardSkeleton variant="compact" />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Grid Skeletons
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                    <NewsCardSkeleton key={i} />
                ))}
            </div>
        );
    }



    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                    Últimas Noticias
                </h2>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Filters */}
            {news.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Filter size={18} />
                        <span className="text-sm font-medium">Filtros:</span>
                    </div>

                    {/* Source Filter */}
                    <select
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        className="bg-background border border-input rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="all">Todos los medios ({news.length})</option>
                        {sources.map(source => (
                            <option key={source} value={source}>
                                {source} ({news.filter(n => n.sourceName === source).length})
                            </option>
                        ))}
                    </select>

                    {/* Actor Filter */}
                    <select
                        value={selectedActor}
                        onChange={(e) => setSelectedActor(e.target.value)}
                        className="bg-background border border-input rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="all">Todos los actores</option>
                        {actors.map(actor => {
                            const count = news.filter(n => (n.matchedActorIds || []).includes(actor.id)).length;
                            return (
                                <option key={actor.id} value={actor.id}>
                                    {actor.name} ({count})
                                </option>
                            );
                        })}
                    </select>

                    {/* Sort Order */}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                        className="bg-background border border-input rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="newest">Más recientes primero</option>
                        <option value="oldest">Más antiguas primero</option>
                    </select>

                    {/* Results count */}
                    <div className="flex items-center text-sm text-muted-foreground ml-auto">
                        Mostrando {filteredNews.length} de {news.length}
                    </div>
                </div>
            )}

            {/* News Rendering */}
            {filteredNews.length === 0 && news.length > 0 ? (
                <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
                    <p>No hay noticias que coincidan con los filtros seleccionados.</p>
                    <button
                        onClick={() => {
                            setSelectedSource('all');
                            setSelectedActor('all');
                        }}
                        className="mt-4 text-primary hover:underline text-sm font-medium"
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : filteredNews.length === 0 ? (
                <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
                    <p>No hay noticias todavía.</p>
                    <p className="text-sm mt-2">Añade fuentes en configuración para empezar.</p>
                </div>
            ) : layout === 'timeline' ? (
                // Timeline Layout
                <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {filteredNews.map((item, index) => {
                        const showDateHeader = index === 0 || !isSameDay(new Date(item.pubDate), new Date(filteredNews[index - 1].pubDate));

                        return (
                            <div key={item.id}>
                                {showDateHeader && (
                                    <div className="flex justify-center mb-8 relative z-10">
                                        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-primary/20 select-none">
                                            {isToday(new Date(item.pubDate))
                                                ? `Hoy, ${format(new Date(item.pubDate), "EEEE d 'de' MMMM", { locale: es })}`
                                                : isYesterday(new Date(item.pubDate))
                                                    ? `Ayer, ${format(new Date(item.pubDate), "EEEE d 'de' MMMM", { locale: es })}`
                                                    : format(new Date(item.pubDate), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                                        </span>
                                    </div>
                                )}
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                    {/* Dot */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                        <span className="text-lg">📰</span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-2">
                                        <NewsCard
                                            item={item}
                                            actors={actors}
                                            onAddActor={onAddActor}
                                            onHide={onHide}
                                            variant="compact"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Grid Layout (Default)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((item) => (
                        <NewsCard key={item.id} item={item} actors={actors} onAddActor={onAddActor} onHide={onHide} />
                    ))}
                </div>
            )}

            {/* Infinite Scroll Sentinel */}
            {hasMore && (
                <div id="sentinel" className="h-20 flex justify-center items-center">
                    {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    ) : (
                        <span className="text-muted-foreground text-sm">Cargando más noticias...</span>
                    )}
                </div>
            )}
        </div>
    );
}
