import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExternalLink } from 'lucide-react';
import { NewsItem, Actor } from '@/types';

interface NewsCardProps {
    item: NewsItem;
    actors: Actor[];
}

export function NewsCard({ item, actors }: NewsCardProps) {
    const matchedActors = actors.filter(a => item.matchedActorIds.includes(a.id));

    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 flex flex-col"
        >
            <div className="flex justify-between items-start gap-4">
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

                    <div className="flex flex-wrap gap-2 mt-auto">
                        {matchedActors.map(actor => (
                            <span
                                key={actor.id}
                                className="px-2 py-1 text-xs rounded-full font-medium"
                                style={{
                                    backgroundColor: `${actor.color}20`,
                                    color: actor.color
                                }}
                            >
                                {actor.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="text-zinc-600 group-hover:text-white p-2 rounded-full group-hover:bg-zinc-800 transition-colors flex-shrink-0">
                    <ExternalLink size={20} />
                </div>
            </div>
        </a>
    );
}
