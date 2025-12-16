"use client";

import { useState, useEffect, useCallback } from 'react';
import { Actor, NewsSource } from '@/types';

export interface AppConfig {
    sources: NewsSource[];
    actors: Actor[];
}

const DEFAULT_CONFIG: AppConfig = {
    sources: [],
    actors: [],
};

export function useConfig() {
    const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch sources and actors from API
    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const [sourcesRes, actorsRes] = await Promise.all([
                fetch('/api/sources'),
                fetch('/api/actors'),
            ]);

            if (sourcesRes.ok && actorsRes.ok) {
                const sourcesData = await sourcesRes.json();
                const actorsData = await actorsRes.json();

                setConfig({
                    sources: sourcesData.sources || [],
                    actors: actorsData.actors || [],
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

    const refetch = () => {
        fetchConfig();
    };

    return {
        config,
        loaded,
        loading,
        addSource,
        removeSource,
        addActor,
        removeActor,
        updateActor,
        refetch,
    };
}
