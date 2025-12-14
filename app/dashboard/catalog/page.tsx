"use client";

import { useState } from 'react';
import { useConfig } from '@/hooks/use-config';
import { MEDIA_CATALOG, CatalogItem } from '@/lib/catalog-data';
import { Plus, Check, Globe, Newspaper, Briefcase, Cpu, Search, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SourceType } from '@/types';

export default function CatalogPage() {
    const { config, addSource, removeSource } = useConfig();
    const [filterLang, setFilterLang] = useState<'all' | 'es' | 'en'>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const addedUrls = new Set(config.sources.map(s => s.url));

    const categories = Array.from(new Set(MEDIA_CATALOG.map(getItem => getItem.category)));

    const filteredCatalog = MEDIA_CATALOG.filter(item => {
        const matchesLang = filterLang === 'all' || item.language === filterLang;
        const matchesCat = filterCategory === 'all' || item.category === filterCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesLang && matchesCat && matchesSearch;
    });

    const handleToggle = (item: CatalogItem) => {
        const existingSource = config.sources.find(s => s.url === item.url);

        if (existingSource) {
            removeSource(existingSource.id);
        } else {
            addSource({
                id: item.id,
                name: item.name,
                url: item.url,
                type: item.type as SourceType,
                selector: item.selector
            });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100">Catálogo de Medios</h1>
                    <p className="text-zinc-400 mt-1">Explora y añade fuentes de noticias verificadas a tu dashboard.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar medio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                </div>

                <select
                    value={filterLang}
                    onChange={(e) => setFilterLang(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                    <option value="all">Todos los idiomas</option>
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                </select>

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
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
                        <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all group relative overflow-hidden">
                            {/* Category Badge */}
                            <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 bg-zinc-800 rounded text-zinc-400">
                                {item.category}
                            </span>

                            <div className="flex items-center gap-3 mb-4">
                                {item.language === 'es' ? <span className="text-xl">🇪🇸</span> : <span className="text-xl">🇺🇸</span>}
                                <h3 className="text-xl font-bold text-zinc-100">{item.name}</h3>
                            </div>

                            <p className="text-zinc-400 text-sm mb-6 min-h-[40px]">
                                {item.description}
                            </p>

                            <button
                                onClick={() => handleToggle(item)}
                                className={cn(
                                    "w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all group/btn",
                                    isAdded
                                        ? "bg-emerald-900/20 text-emerald-500 border border-emerald-900/50 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50"
                                        : "bg-zinc-100 text-zinc-900 hover:bg-white hover:scale-[1.02]"
                                )}
                            >
                                {isAdded ? (
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
                <div className="text-center py-20 text-zinc-500">
                    No se encontraron medios con esos filtros.
                </div>
            )}
        </div>
    );
}
