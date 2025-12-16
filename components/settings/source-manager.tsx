"use client";

import { useState } from 'react';
import { Plus, Trash2, Rss, Globe, Loader2 } from 'lucide-react';
import { NewsSource } from '@/types';

interface SourceManagerProps {
    sources: NewsSource[];
    onAdd: (source: Omit<NewsSource, 'id'>) => Promise<NewsSource | null>;
    onRemove: (id: string) => Promise<boolean>;
}

export function SourceManager({ sources, onAdd, onRemove }: SourceManagerProps) {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState<'rss' | 'web'>('rss');
    const [selector, setSelector] = useState('');
    const [adding, setAdding] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !name) return;
        if (type === 'web' && !selector) return;

        setAdding(true);
        try {
            await onAdd({
                name,
                url,
                type,
                selector: type === 'web' ? selector : undefined
            });
            setUrl('');
            setName('');
            setSelector('');
            setType('rss');
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (id: string) => {
        setRemovingId(id);
        try {
            await onRemove(id);
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Rss size={20} className="text-primary" />
                Fuentes de Noticias
            </h3>

            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Nombre del sitio (ej. El País)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background border border-input text-foreground rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-ring outline-none"
                        disabled={adding}
                    />
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as 'rss' | 'web')}
                        className="bg-background border border-input text-foreground rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none"
                        disabled={adding}
                    >
                        <option value="rss">RSS Feed</option>
                        <option value="web">Web Scraping</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <input
                        type="url"
                        placeholder={type === 'rss' ? "URL del Feed RSS" : "URL de la página web"}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-background border border-input text-foreground rounded-lg px-4 py-2 flex-[2] focus:ring-2 focus:ring-ring outline-none"
                        disabled={adding}
                    />

                    {type === 'web' && (
                        <input
                            type="text"
                            placeholder="Selector CSS (ej. article h2 a)"
                            value={selector}
                            onChange={(e) => setSelector(e.target.value)}
                            className="bg-background border border-input text-foreground rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-ring outline-none"
                            disabled={adding}
                        />
                    )}

                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        disabled={!name || !url || (type === 'web' && !selector) || adding}
                    >
                        {adding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        Añadir
                    </button>
                </div>
            </form>

            <div className="space-y-3">
                {sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <div className="bg-secondary p-2 rounded text-muted-foreground">
                                {source.type === 'rss' ? (
                                    <Rss size={16} />
                                ) : (
                                    <Globe size={16} />
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-foreground">{source.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {source.url}
                                    {source.type === 'web' && <span className="ml-2 px-1 bg-muted text-muted-foreground rounded border border-border">Scraping: {source.selector}</span>}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemove(source.id)}
                            disabled={removingId === source.id}
                            className="text-muted-foreground hover:text-destructive p-2 transition-colors disabled:opacity-50"
                        >
                            {removingId === source.id ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Trash2 size={18} />
                            )}
                        </button>
                    </div>
                ))}
                {sources.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-4">No hay fuentes configuradas.</p>
                )}
            </div>
        </div>
    );
}
