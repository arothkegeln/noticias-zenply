"use client";

import { useState } from 'react';
import { useConfig } from '@/hooks/use-config';
import { MEDIA_CATALOG, CatalogItem } from '@/lib/catalog-data';
import { Plus, Check, Search, Minus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SourceType } from '@/types';

export default function CatalogPage() {
    const { config, addSource, removeSource } = useConfig();
    const [filterLang, setFilterLang] = useState<'all' | 'es' | 'en'>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const addedUrls = new Set(config.sources.map(s => s.url));

    const categories = Array.from(new Set(MEDIA_CATALOG.map(getItem => getItem.category)));

    const filteredCatalog = MEDIA_CATALOG.filter(item => {
        const matchesLang = filterLang === 'all' || item.language === filterLang;
        const matchesCat = filterCategory === 'all' || item.category === filterCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesLang && matchesCat && matchesSearch;
    });

    const handleToggle = async (item: CatalogItem) => {
        setLoadingId(item.id);
        try {
            const existingSource = config.sources.find(s => s.url === item.url);

            if (existingSource) {
                await removeSource(existingSource.id);
            } else {
                await addSource({
                    name: item.name,
                    url: item.url,
                    type: item.type as SourceType,
                    selector: item.selector
                });
            }
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Catálogo de Medios</h1>
                    <p className="text-muted-foreground mt-1">Explora y añade fuentes de noticias verificadas a tu dashboard.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar medio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-input rounded-lg pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <select
                    value={filterLang}
                    onChange={(e) => setFilterLang(e.target.value as any)}
                    className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="all">Todos los idiomas</option>
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                </select>

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="all">Todas las categorías</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCatalog.map(item => {
                    const isAdded = addedUrls.has(item.url);

                    return (
                        <div key={item.id} className="bg-card border border-border rounded-xl p-6 hover:border-foreground/20 transition-all group relative overflow-hidden">
                            {/* Category Badge */}
                            <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 bg-secondary text-secondary-foreground rounded">
                                {item.category}
                            </span>

                            <div className="flex items-center gap-3 mb-4">
                                {item.language === 'es' ? <span className="text-xl">🇪🇸</span> : <span className="text-xl">🇺🇸</span>}
                                <h3 className="text-xl font-bold text-card-foreground">{item.name}</h3>
                            </div>

                            <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">
                                {item.description}
                            </p>

                            <button
                                onClick={() => handleToggle(item)}
                                disabled={loadingId === item.id}
                                className={cn(
                                    "w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all group/btn disabled:opacity-50",
                                    isAdded
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-900/50"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]"
                                )}
                            >
                                {loadingId === item.id ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : isAdded ? (
                                    <>
                                        <span className="group-hover/btn:hidden flex items-center gap-2">
                                            <Check size={18} />
                                            Agregado
                                        </span>
                                        <span className="hidden group-hover/btn:flex items-center gap-2">
                                            <Minus size={18} />
                                            Quitar
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Añadir al Dashboard
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {filteredCatalog.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No se encontraron medios con esos filtros.
                </div>
            )}
        </div>
    );
}
