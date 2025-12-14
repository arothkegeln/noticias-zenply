import { NewsItem, Actor } from '@/types';
import { NewsCard } from './news-card';
import { RefreshCw } from 'lucide-react';

interface NewsFeedProps {
    news: NewsItem[];
    actors: Actor[];
    loading: boolean;
    onRefresh: () => void;
}

export function NewsFeed({ news, actors, loading, onRefresh }: NewsFeedProps) {
    if (loading && news.length === 0) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                        <p>No hay noticias todavía.</p>
                        <p className="text-sm mt-2">Añade fuentes en configuración para empezar.</p>
                    </div>
                ) : (
                    news.map((item) => (
                        <NewsCard key={item.id} item={item} actors={actors} />
                    ))
                )}
            </div>
        </div>
    );
}
