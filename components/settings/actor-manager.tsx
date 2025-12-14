"use client";

import { useState } from 'react';
import { Plus, Trash2, Tag, Users } from 'lucide-react';
import { Actor } from '@/types';

interface ActorManagerProps {
    actors: Actor[];
    onAdd: (actor: Actor) => void;
    onRemove: (id: string) => void;
}

const PRESET_COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

export function ActorManager({ actors, onAdd, onRemove }: ActorManagerProps) {
    const [name, setName] = useState('');
    const [keywords, setKeywords] = useState('');
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !keywords) return;

        onAdd({
            id: Math.random().toString(36).substr(2, 9),
            name,
            keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
            color: selectedColor
        });
        setName('');
        setKeywords('');
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-100 flex items-center gap-2">
                <Users size={20} className="text-emerald-400" />
                Actores y Seguimiento
            </h3>

            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Nombre (ej. Caso XYZ)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <div className="flex gap-2 items-center bg-zinc-800 rounded-lg px-2 border border-zinc-700">
                        {PRESET_COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className={`w-6 h-6 rounded-full transition-transform ${selectedColor === color ? 'scale-125 ring-2 ring-white' : ''}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Palabras clave separadas por coma (ej. empresa A, director B)"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        disabled={!name || !keywords}
                    >
                        <Plus size={18} />
                        Crear
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actors.map((actor) => (
                    <div key={actor.id} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: actor.color }} />
                                <span className="font-bold text-zinc-200">{actor.name}</span>
                            </div>
                            <button
                                onClick={() => onRemove(actor.id)}
                                className="text-zinc-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {actor.keywords.map((k, i) => (
                                <span key={i} className="text-xs bg-zinc-900 border border-zinc-700 text-zinc-400 px-2 py-1 rounded">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
                {actors.length === 0 && (
                    <div className="col-span-full text-center py-4 text-zinc-500">
                        No hay actores definidos.
                    </div>
                )}
            </div>
        </div>
    );
}
