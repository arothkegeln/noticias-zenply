"use client";

import { useState } from 'react';
import { Plus, Trash2, Users, Loader2 } from 'lucide-react';
import { Actor } from '@/types';

interface ActorManagerProps {
    actors: Actor[];
    onAdd: (actor: Omit<Actor, 'id'>) => Promise<Actor | null>;
    onRemove: (id: string) => Promise<boolean>;
}

const PRESET_COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

export function ActorManager({ actors, onAdd, onRemove }: ActorManagerProps) {
    const [name, setName] = useState('');
    const [keywords, setKeywords] = useState('');
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
    const [adding, setAdding] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !keywords) return;

        setAdding(true);
        try {
            await onAdd({
                name,
                keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
                color: selectedColor
            });
            setName('');
            setKeywords('');
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
                <Users size={20} className="text-primary" />
                Actores y Seguimiento
            </h3>

            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Nombre (ej. Caso XYZ)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background border border-input text-foreground rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-ring outline-none"
                        disabled={adding}
                    />
                    <div className="flex gap-2 items-center bg-background rounded-lg px-2 border border-input">
                        {PRESET_COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className={`w-6 h-6 rounded-full transition-transform ${selectedColor === color ? 'scale-125 ring-2 ring-ring' : ''}`}
                                style={{ backgroundColor: color }}
                                disabled={adding}
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
                        className="bg-background border border-input text-foreground rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-ring outline-none"
                        disabled={adding}
                    />
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        disabled={!name || !keywords || adding}
                    >
                        {adding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        Crear
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actors.map((actor) => (
                    <div key={actor.id} className="p-4 bg-secondary/30 rounded-lg border border-border hover:border-foreground/20 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: actor.color }} />
                                <span className="font-bold text-foreground">{actor.name}</span>
                            </div>
                            <button
                                onClick={() => handleRemove(actor.id)}
                                disabled={removingId === actor.id}
                                className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                            >
                                {removingId === actor.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {actor.keywords.map((k, i) => (
                                <span key={i} className="text-xs bg-background border border-border text-muted-foreground px-2 py-1 rounded">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
                {actors.length === 0 && (
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                        No hay actores definidos.
                    </div>
                )}
            </div>
        </div>
    );
}
