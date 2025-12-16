"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Newspaper, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from './mode-toggle';

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: 'Feed de Noticias', icon: Home },
        { href: '/dashboard/catalog', label: 'Catálogo de Medios', icon: Globe },
        { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
        { href: '/dashboard/debug', label: 'Debug', icon: Settings },
    ];

    return (
        <div className="w-64 h-screen bg-card text-card-foreground border-r border-border flex flex-col p-4 fixed left-0 top-0 transition-colors duration-300">
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
