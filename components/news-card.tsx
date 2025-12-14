"use client";

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExternalLink, Plus } from 'lucide-react';
import { NewsItem, Actor, Tag } from '@/types';
import { useConfig } from '@/hooks/use-config';
import { useState } from 'react';

interface NewsCardProps {
    item: NewsItem;
    actors: Actor[];
}

const TAG_COLORS = {
    company: { bg: 'bg-blue-900/20', text: 'text-blue-400', border: 'border-blue-900/50' },
    person: { bg: 'bg-purple-900/20', text: 'text-purple-400', border: 'border-purple-900/50' },
    country: { bg: 'bg-emerald-900/20', text: 'text-emerald-400', border: 'border-emerald-900/50' },
    concept: { bg: 'bg-amber-900/20', text: 'text-amber-400', border: 'border-amber-900/50' },
};

const TAG_ICONS = {
    company: '🏢',
    person: '👤',
    country: '🌍',
    concept: '💡',
};

export function NewsCard({ item, actors }: NewsCardProps) {
    const { addActor } = useConfig();
    const matchedActors = actors.filter(a => item.matchedActorIds.includes(a.id));
    const [addingTag, setAddingTag] = useState<string | null>(null);

    const handleAddTag = (e: React.MouseEvent, tag: Tag) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if actor already exists
        const exists = actors.some(a =>
            a.keywords.some(k => k.toLowerCase() === tag.text.toLowerCase())
        );

        if (exists) {
            alert(`El actor "${tag.text}" ya existe en tu configuración`);
            return;
        }

        // Add as new actor
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        addActor({
            id: Math.random().toString(36).substr(2, 9),
            name: tag.text,
            keywords: [tag.text],
            color: randomColor
        });

        setAddingTag(tag.text);
        setTimeout(() => setAddingTag(null), 2000);
    };

    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 flex flex-col"
        >
            <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            {item.sourceName}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs text-zinc-500">
                            {formatDistanceToNow(new Date(item.pubDate), { addSuffix: true, locale: es })}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-100 mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                        {item.title}
                    </h3>

                    {item.contentSnippet && (
                        <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
                            {item.contentSnippet}
                        </p>
                    )}
                </div>

                <div className="text-zinc-600 group-hover:text-white p-2 rounded-full group-hover:bg-zinc-800 transition-colors flex-shrink-0">
                    <ExternalLink size={20} />
                </div>
            </div>

            {/* Matched Actors */}
            {matchedActors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {matchedActors.map(actor => (
                        <span
                            key={actor.id}
                            className="px-2 py-1 text-xs rounded-full font-medium"
                            style={{
                                backgroundColor: `${actor.color}20`,
                                color: actor.color
                            }}
                        >
                            ⭐ {actor.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Smart Tags */}
            {item.tags && item.tags.length > 0 && (
                <div className="mt-auto pt-3 border-t border-zinc-800">
                    <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, idx) => {
                            const colors = TAG_COLORS[tag.category];
                            const icon = TAG_ICONS[tag.category];
                            const isAdding = addingTag === tag.text;

                            return (
                                <button
                                    key={idx}
                                    onClick={(e) => handleAddTag(e, tag)}
                                    className={`group/tag px-2 py-1 text-xs rounded-md font-medium border transition-all hover:scale-105 ${colors.bg} ${colors.text} ${colors.border} hover:shadow-md flex items-center gap-1`}
                                    title={`Agregar "${tag.text}" como Actor`}
                                >
                                    <span>{icon}</span>
                                    <span>{tag.text}</span>
                                    {isAdding ? (
                                        <span className="text-green-400">✓</span>
                                    ) : (
                                        <Plus size={12} className="opacity-0 group-hover/tag:opacity-100 transition-opacity" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </a>
    );
}
