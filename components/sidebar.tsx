"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Newspaper, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: 'Feed de Noticias', icon: Home },
        { href: '/dashboard/catalog', label: 'Catálogo de Medios', icon: Globe },
        { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
        { href: '/dashboard/debug', label: 'Debug', icon: Settings },
    ];

    return (
        <div className="w-64 h-screen bg-zinc-900 text-white border-r border-zinc-800 flex flex-col p-4 fixed left-0 top-0">
            <div className="flex items-center gap-2 mb-8 px-2">
                <Newspaper className="bg-blue-600 p-1 rounded h-8 w-8 text-white" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
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
                                    ? "bg-blue-600/20 text-blue-400"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                            )}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-zinc-800">
                <Link
                    href="/api/auth/signout"
                    className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                >
                    <span className="font-medium">Cerrar Sesión</span>
                </Link>
            </div>
        </div>
    );
}
