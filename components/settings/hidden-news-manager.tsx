"use client";

import { useState, useEffect } from 'react';
import { EyeOff, Trash2, Loader2 } from 'lucide-react';
import { HiddenNews } from '@/hooks/use-config';

interface HiddenNewsManagerProps {
    onUnhide: (id: string, newsUrl: string) => Promise<boolean>;
}

export function HiddenNewsManager({ onUnhide }: HiddenNewsManagerProps) {
    const [hiddenNews, setHiddenNews] = useState<HiddenNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        fetchHiddenNews();
    }, []);

    const fetchHiddenNews = async () => {
        try {
            const res = await fetch('/api/hidden-news');
            if (res.ok) {
                const data = await res.json();
                setHiddenNews(data.hiddenNews || []);
            }
        } catch (error) {
            console.error('Error fetching hidden news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnhide = async (id: string, newsUrl: string) => {
        setRemovingId(id);
        try {
            const success = await onUnhide(id, newsUrl);
            if (success) {
                setHiddenNews(prev => prev.filter(item => item.id !== id));
            }
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-muted-foreground" size={24} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <EyeOff size={20} className="text-primary" />
                Noticias Ocultas
            </h3>

            {hiddenNews.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">
                    No has ocultado ninguna noticia.
                </p>
            ) : (
                <div className="space-y-3">
                    {hiddenNews.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-start justify-between p-3 bg-secondary/50 rounded-lg border border-border"
                        >
                            <div className="flex-1 mr-4">
                                <p className="text-sm font-medium text-foreground line-clamp-2">
                                    {item.newsTitle}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {item.newsUrl}
                                </p>
                            </div>
                            <button
                                onClick={() => handleUnhide(item.id, item.newsUrl)}
                                disabled={removingId === item.id}
                                className="text-muted-foreground hover:text-primary p-2 transition-colors disabled:opacity-50 flex-shrink-0"
                                title="Mostrar de nuevo"
                            >
                                {removingId === item.id ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Trash2 size={18} />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {hiddenNews.length > 0 && (
                <p className="text-xs text-muted-foreground mt-4 text-center">
                    {hiddenNews.length} {hiddenNews.length === 1 ? 'noticia oculta' : 'noticias ocultas'}
                </p>
            )}
        </div>
    );
}
