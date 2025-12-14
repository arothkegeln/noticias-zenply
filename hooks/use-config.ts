"use client";

import { useState, useEffect } from 'react';
import { Actor, NewsSource } from '@/types';

const STORAGE_KEY = 'zenply-news-config';

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

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setConfig(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse config", e);
            }
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        }
    }, [config, loaded]);

    const addSource = (source: NewsSource) => {
        setConfig(prev => ({ ...prev, sources: [...prev.sources, source] }));
    };

    const removeSource = (id: string) => {
        setConfig(prev => ({ ...prev, sources: prev.sources.filter(s => s.id !== id) }));
    };

    const addActor = (actor: Actor) => {
        setConfig(prev => ({ ...prev, actors: [...prev.actors, actor] }));
    };

    const removeActor = (id: string) => {
        setConfig(prev => ({ ...prev, actors: prev.actors.filter(a => a.id !== id) }));
    };

    const updateActor = (actor: Actor) => {
        setConfig(prev => ({
            ...prev,
            actors: prev.actors.map(a => a.id === actor.id ? actor : a)
        }));
    };

    return {
        config,
        loaded,
        addSource,
        removeSource,
        addActor,
        removeActor,
        updateActor
    };
}
