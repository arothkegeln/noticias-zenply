"use client";

import { useState, useMemo } from 'react';
import { NewsItem, Actor } from '@/types';
import { NewsCard } from './news-card';
import { RefreshCw, Filter } from 'lucide-react';

interface NewsFeedProps {
    news: NewsItem[];
    actors: Actor[];
    loading: boolean;
    onRefresh: () => void;
}

export function NewsFeed({ news, actors, loading, onRefresh }: NewsFeedProps) {
    const [selectedSource, setSelectedSource] = useState<string>('all');
    const [selectedActor, setSelectedActor] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    // Get unique sources from news
    const sources = useMemo(() => {
        const uniqueSources = Array.from(new Set(news.map(item => item.sourceName)));
        return uniqueSources.sort();
    }, [news]);

    // Filter and sort news
    const filteredNews = useMemo(() => {
        let filtered = [...news];

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
    }, [news, selectedSource, selectedActor, sortOrder]);

    if (loading && news.length === 0) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
                    Últimas Noticias
                </h2>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Filters */}
            {news.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Filter size={18} />
                        <span className="text-sm font-medium">Filtros:</span>
                    </div>

                    {/* Source Filter */}
                    <select
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 text-sm focus:outline-none focus:border-emerald-500"
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
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 text-sm focus:outline-none focus:border-emerald-500"
                    >
                        <option value="all">Todos los actores</option>
                        {actors.map(actor => {
                            const count = news.filter(n => n.matchedActorIds.includes(actor.id)).length;
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
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 text-sm focus:outline-none focus:border-emerald-500"
                    >
                        <option value="newest">Más recientes primero</option>
                        <option value="oldest">Más antiguas primero</option>
                    </select>

                    {/* Results count */}
                    <div className="flex items-center text-sm text-zinc-500 ml-auto">
                        Mostrando {filteredNews.length} de {news.length}
                    </div>
                </div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.length === 0 && news.length > 0 ? (
                    <div className="col-span-full text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                        <p>No hay noticias que coincidan con los filtros seleccionados.</p>
                        <button
                            onClick={() => {
                                setSelectedSource('all');
                                setSelectedActor('all');
                            }}
                            className="mt-4 text-emerald-500 hover:text-emerald-400 text-sm"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                        <p>No hay noticias todavía.</p>
                        <p className="text-sm mt-2">Añade fuentes en configuración para empezar.</p>
                    </div>
                ) : (
                    filteredNews.map((item) => (
                        <NewsCard key={item.id} item={item} actors={actors} />
                    ))
                )}
            </div>
        </div>
    );
}
