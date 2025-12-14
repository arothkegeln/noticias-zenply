"use client";

import { useState } from 'react';
import { Plus, Trash2, Link as LinkIcon, Rss, Globe } from 'lucide-react';
import { NewsSource } from '@/types';

interface SourceManagerProps {
    sources: NewsSource[];
    onAdd: (source: NewsSource) => void;
    onRemove: (id: string) => void;
}

export function SourceManager({ sources, onAdd, onRemove }: SourceManagerProps) {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState<'rss' | 'web'>('rss');
    const [selector, setSelector] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !name) return;
        if (type === 'web' && !selector) return;

        onAdd({
            id: Math.random().toString(36).substr(2, 9),
            name,
            url,
            type,
            selector: type === 'web' ? selector : undefined
        });
        setUrl('');
        setName('');
        setSelector('');
        setType('rss');
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-100 flex items-center gap-2">
                <Rss size={20} className="text-blue-400" />
                Fuentes de Noticias
            </h3>

            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Nombre del sitio (ej. El País)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as 'rss' | 'web')}
                        className="bg-zinc-800 border-zinc-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
                        className="bg-zinc-800 border-zinc-700 text-white rounded-lg px-4 py-2 flex-[2] focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {type === 'web' && (
                        <input
                            type="text"
                            placeholder="Selector CSS (ej. article h2 a)"
                            value={selector}
                            onChange={(e) => setSelector(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    )}

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        disabled={!name || !url || (type === 'web' && !selector)}
                    >
                        <Plus size={18} />
                        Añadir
                    </button>
                </div>
            </form>

            <div className="space-y-3">
                {sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="bg-zinc-800 p-2 rounded">
                                {source.type === 'rss' ? (
                                    <Rss size={16} className="text-zinc-400" />
                                ) : (
                                    <Globe size={16} className="text-emerald-400" />
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-zinc-200">{source.name}</div>
                                <div className="text-xs text-zinc-500">
                                    {source.url}
                                    {source.type === 'web' && <span className="ml-2 px-1 bg-emerald-900/30 text-emerald-400 rounded">Scraping: {source.selector}</span>}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onRemove(source.id)}
                            className="text-zinc-500 hover:text-red-400 p-2 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                {sources.length === 0 && (
                    <p className="text-center text-zinc-500 text-sm py-4">No hay fuentes configuradas.</p>
                )}
            </div>
        </div>
    );
}
