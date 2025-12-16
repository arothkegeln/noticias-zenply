"use client";

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExternalLink, Plus, X } from 'lucide-react';
import { NewsItem, Actor, Tag } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewsCardProps {
    item: NewsItem;
    actors: Actor[];
    onAddActor: (actor: Omit<Actor, 'id'>) => Promise<Actor | null>;
    onHide?: (newsUrl: string, newsTitle: string) => Promise<boolean>;
    variant?: 'default' | 'compact';
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

export function NewsCard({ item, actors, onAddActor, onHide, variant = 'default' }: NewsCardProps) {
    const matchedActors = actors.filter(a => item.matchedActorIds.includes(a.id));
    const [addingTag, setAddingTag] = useState<string | null>(null);
    const [hiding, setHiding] = useState(false);
    const [imageError, setImageError] = useState(false);
    const router = useRouter();

    // Generate a deterministic color gradient based on source name length
    const getGradient = (name: string) => {
        const colors = [
            'from-blue-500 to-cyan-500',
            'from-emerald-500 to-teal-500',
            'from-orange-500 to-amber-500',
            'from-purple-500 to-pink-500',
            'from-indigo-500 to-blue-500',
            'from-rose-500 to-red-500'
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    const handleTagClick = (e: React.MouseEvent, tag: Tag) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/dashboard/topics/${encodeURIComponent(tag.text)}`);
    };

    const handleAddActorFromCard = (e: React.MouseEvent, tag: Tag) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if actor already exists
        const exists = actors.some(a =>
            a.keywords.some(k => k.toLowerCase() === tag.text.toLowerCase())
        );

        if (exists) {
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

    const handleHide = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onHide && !hiding) {
            setHiding(true);
            await onHide(item.link, item.title);
            setHiding(false);
        }
    };

    const isCompact = variant === 'compact';

    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group block h-full bg-card border border-border rounded-xl hover:border-foreground/20 transition-all duration-300 hover:shadow-lg flex ${isCompact ? 'flex-row items-center gap-4 p-3' : 'flex-col p-5'}`}
        >
            <div className={`relative overflow-hidden border-b border-border bg-muted/30 shrink-0 ${isCompact ? 'w-24 h-24 rounded-lg border-b-0 border border-border' : 'w-full aspect-video rounded-t-xl mb-4'}`}>
                {item.imageUrl && !imageError ? (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    // Fabricated Thumbnail
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(item.sourceName)} opacity-80 flex flex-col items-center justify-center p-4 text-white`}>
                        <span className={`${isCompact ? 'text-2xl' : 'text-4xl'} mb-2`}>📰</span>
                        <span className={`font-bold text-center drop-shadow-md opacity-90 ${isCompact ? 'text-xs hidden' : 'text-sm'}`}>{item.sourceName}</span>
                    </div>
                )}
            </div>

            <div className={`flex flex-col justify-between ${isCompact ? 'flex-1 h-full' : ''}`}>
                <div className={`flex justify-between items-start gap-4 mb-2 ${!item.imageUrl && !isCompact ? 'mt-2' : ''}`}>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {item.sourceName}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(item.pubDate), "d 'de' MMMM, HH:mm", { locale: es })}
                            </span>
                        </div>

                        <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-bold text-card-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2`}>
                            {item.title}
                        </h3>
                    </div>

                    <div className="flex items-start gap-2">
                        {onHide && (
                            <button
                                onClick={handleHide}
                                disabled={hiding}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                                title="No volver a ver"
                            >
                                <X size={16} />
                            </button>
                        )}
                        {!isCompact && <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />}
                    </div>
                </div>

                {!isCompact && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                        {item.contentSnippet || item.content}
                    </p>
                )}

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

                {item.tags && item.tags.length > 0 && !isCompact && (
                    <div className="mt-auto pt-3 border-t border-border">
                        <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag, idx) => {
                                const colors = TAG_COLORS[tag.category];
                                const icon = TAG_ICONS[tag.category];
                                const isAdding = addingTag === tag.text;

                                return (
                                    <div key={idx} className={`group/tag flex items-center gap-1 px-2 py-1 text-xs rounded-md font-medium border transition-all ${colors.bg} ${colors.text} ${colors.border} hover:shadow-md`}>
                                        <button
                                            onClick={(e) => handleTagClick(e, tag)}
                                            className="flex items-center gap-1 hover:underline underline-offset-2 decoration-dotted bg-transparent border-0 cursor-pointer p-0 font-medium"
                                            title={`Ver noticias sobre "${tag.text}"`}
                                        >
                                            <span>{icon}</span>
                                            <span>{tag.text}</span>
                                        </button>

                                        <button
                                            onClick={(e) => handleAddActorFromCard(e, tag)}
                                            className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                                            title={`Seguir "${tag.text}"`}
                                        >
                                            {isAdding ? (
                                                <span className="text-green-500 font-bold">✓</span>
                                            ) : (
                                                <Plus size={10} className="text-muted-foreground hover:text-foreground" />
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </a>
    );
}
