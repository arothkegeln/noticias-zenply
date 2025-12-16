"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Newspaper, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link as LinkIcon, ChevronDown, ChevronRight, Hash } from 'lucide-react';
import { useConfig } from '@/hooks/use-config';
import { useState } from 'react';
import { ModeToggle } from './mode-toggle';

export function Sidebar() {
    const pathname = usePathname();
    const { config } = useConfig();
    const [topicsOpen, setTopicsOpen] = useState(true);

    const links = [
        { href: '/dashboard', label: 'Feed de Noticias', icon: Home },
        { href: '/dashboard/catalog', label: 'Catálogo de Medios', icon: Globe },
        { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
        { href: '/dashboard/debug', label: 'Debug', icon: Settings },
    ];

    return (
        <div className="hidden md:flex w-64 h-screen bg-card text-card-foreground border-r border-border flex-col p-4 fixed left-0 top-0 transition-colors duration-300 z-50">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="bg-primary p-1 rounded">
                    <Newspaper className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
                    Noticias Zenply
                </span>
            </div>

            <nav className="space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8">
                <button
                    onClick={() => setTopicsOpen(!topicsOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                    <span>Temas Seguidos</span>
                    {topicsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {topicsOpen && (
                    <div className="mt-2 space-y-1 overflow-y-auto max-h-[40vh] px-2 custom-scrollbar">
                        {config.actors.length === 0 ? (
                            <p className="text-xs text-muted-foreground px-3 py-2 italic">
                                No sigues ningún tema aún.
                            </p>
                        ) : (
                            config.actors.map((actor) => {
                                const isActive = pathname === `/dashboard/topics/${actor.name}`;
                                return (
                                    <Link
                                        key={actor.id}
                                        href={`/dashboard/topics/${actor.name}`}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                        )}
                                    >
                                        <Hash size={14} className="opacity-70" />
                                        <span className="truncate">{actor.name}</span>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-2">
                <Link
                    href="/api/auth/signout"
                    className="flex-1 flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200"
                >
                    <span className="font-medium text-sm">Cerrar Sesión</span>
                </Link>
                <div className="px-2">
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
}
