"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Actor, NewsSource } from '@/types';

export interface HiddenNews {
    id: string;
    newsUrl: string;
    newsTitle: string;
    hiddenAt: string;
}

export interface AppConfig {
    sources: NewsSource[];
    actors: Actor[];
    hiddenNewsUrls: Set<string>;
}

const DEFAULT_CONFIG: AppConfig = {
    sources: [],
    actors: [],
    hiddenNewsUrls: new Set<string>(),
};

interface ConfigContextType {
    config: AppConfig;
    loaded: boolean;
    loading: boolean;
    addSource: (source: Omit<NewsSource, 'id'>) => Promise<NewsSource | null>;
    removeSource: (id: string) => Promise<boolean>;
    addActor: (actor: Omit<Actor, 'id'>) => Promise<Actor | null>;
    removeActor: (id: string) => Promise<boolean>;
    updateActor: (actor: Actor) => Promise<Actor | null>;
    hideNews: (newsUrl: string, newsTitle: string) => Promise<boolean>;
    unhideNews: (id: string, newsUrl: string) => Promise<boolean>;
    refetch: () => void;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch sources, actors, and hidden news from API
    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const [sourcesRes, actorsRes, hiddenNewsRes] = await Promise.all([
                fetch('/api/sources'),
                fetch('/api/actors'),
                fetch('/api/hidden-news'),
            ]);

            if (sourcesRes.ok && actorsRes.ok && hiddenNewsRes.ok) {
                const sourcesData = await sourcesRes.json();
                const actorsData = await actorsRes.json();
                const hiddenNewsData = await hiddenNewsRes.json();

                const hiddenUrls = new Set<string>(
                    (hiddenNewsData.hiddenNews || []).map((item: HiddenNews) => item.newsUrl)
                );

                setConfig({
                    sources: sourcesData.sources || [],
                    actors: actorsData.actors || [],
                    hiddenNewsUrls: hiddenUrls,
                });
            }
        } catch (error) {
            console.error("Failed to fetch config:", error);
        } finally {
            setLoading(false);
            setLoaded(true);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    const addSource = async (source: Omit<NewsSource, 'id'>) => {
        try {
            const res = await fetch('/api/sources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(source),
            });

            if (res.ok) {
                const data = await res.json();
                setConfig(prev => ({
                    ...prev,
                    sources: [data.source, ...prev.sources],
                }));
                return data.source;
            }
        } catch (error) {
            console.error("Failed to add source:", error);
        }
        return null;
    };

    const removeSource = async (id: string) => {
        try {
            const res = await fetch(`/api/sources/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setConfig(prev => ({
                    ...prev,
                    sources: prev.sources.filter(s => s.id !== id),
                }));
                return true;
            }
        } catch (error) {
            console.error("Failed to remove source:", error);
        }
        return false;
    };

    const addActor = async (actor: Omit<Actor, 'id'>) => {
        try {
            const res = await fetch('/api/actors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(actor),
            });

            if (res.ok) {
                const data = await res.json();
                setConfig(prev => ({
                    ...prev,
                    actors: [data.actor, ...prev.actors],
                }));
                return data.actor;
            }
        } catch (error) {
            console.error("Failed to add actor:", error);
        }
        return null;
    };

    const removeActor = async (id: string) => {
        try {
            const res = await fetch(`/api/actors/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setConfig(prev => ({
                    ...prev,
                    actors: prev.actors.filter(a => a.id !== id),
                }));
                return true;
            }
        } catch (error) {
            console.error("Failed to remove actor:", error);
        }
        return false;
    };

    const updateActor = async (actor: Actor) => {
        try {
            const res = await fetch(`/api/actors/${actor.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(actor),
            });

            if (res.ok) {
                const data = await res.json();
                setConfig(prev => ({
                    ...prev,
                    actors: prev.actors.map(a => a.id === actor.id ? data.actor : a),
                }));
                return data.actor;
            }
        } catch (error) {
            console.error("Failed to update actor:", error);
        }
        return null;
    };

    const hideNews = async (newsUrl: string, newsTitle: string) => {
        try {
            const res = await fetch('/api/hidden-news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newsUrl, newsTitle }),
            });

            if (res.ok) {
                setConfig(prev => ({
                    ...prev,
                    hiddenNewsUrls: new Set([...prev.hiddenNewsUrls, newsUrl]),
                }));
                return true;
            }
        } catch (error) {
            console.error("Failed to hide news:", error);
        }
        return false;
    };

    const unhideNews = async (id: string, newsUrl: string) => {
        try {
            const res = await fetch(`/api/hidden-news/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setConfig(prev => {
                    const newUrls = new Set(prev.hiddenNewsUrls);
                    newUrls.delete(newsUrl);
                    return {
                        ...prev,
                        hiddenNewsUrls: newUrls,
                    };
                });
                return true;
            }
        } catch (error) {
            console.error("Failed to unhide news:", error);
        }
        return false;
    };

    const value = {
        config,
        loaded,
        loading,
        addSource,
        removeSource,
        addActor,
        removeActor,
        updateActor,
        hideNews,
        unhideNews,
        refetch: fetchConfig,
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
}
