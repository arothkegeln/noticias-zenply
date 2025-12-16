"use client";

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExternalLink, Plus } from 'lucide-react';
import { NewsItem, Actor, Tag } from '@/types';
import { useState } from 'react';
interface NewsCardProps {
    item: NewsItem;
    actors: Actor[];
    onAddActor: (actor: Omit<Actor, 'id'>) => Promise<Actor | null>;
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

export function NewsCard({ item, actors, onAddActor }: NewsCardProps) {
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

        onAddActor({
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
            className="group block h-full bg-card border border-border rounded-xl p-5 hover:border-foreground/20 transition-all duration-300 hover:shadow-lg flex flex-col"
        >
            <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {item.sourceName}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.pubDate), { addSuffix: true, locale: es })}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-card-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                        {item.title}
                    </h3>

                    {item.contentSnippet && (
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                            {item.contentSnippet}
                        </p>
                    )}
                </div>

                <div className="text-muted-foreground group-hover:text-foreground p-2 rounded-full group-hover:bg-accent transition-colors flex-shrink-0">
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
                <div className="mt-auto pt-3 border-t border-border">
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
                                        <span className="text-green-500">✓</span>
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
