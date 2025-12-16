"use client";

import { useState } from 'react';
import { Menu, X, Newspaper } from 'lucide-react';
import { Sidebar } from './sidebar';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Settings, Globe } from 'lucide-react';

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: 'Feed', icon: Home },
        { href: '/dashboard/catalog', label: 'Catálogo', icon: Globe },
        { href: '/dashboard/settings', label: 'Config', icon: Settings },
    ];

    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <div className="bg-primary p-1 rounded">
                    <Newspaper className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
                    Zenply
                </span>
            </div>

            <div className="flex items-center gap-2">
                <ModeToggle />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-md hover:bg-accent focus:outline-none"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="fixed inset-0 top-16 bg-background z-50 flex flex-col p-4 animate-in slide-in-from-top-5 duration-200">
                    <nav className="flex flex-col space-y-4 text-lg">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent"
                                    )}
                                >
                                    <Icon size={24} />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            );
                        })}
                        <Link
                            href="/api/auth/signout"
                            className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg mt-auto"
                        >
                            <span className="font-medium">Cerrar Sesión</span>
                        </Link>
                    </nav>
                </div>
            )}
        </div>
    );
}
