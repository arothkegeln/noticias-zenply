"use client";

import { useConfig } from '@/hooks/use-config';
import { SourceManager } from '@/components/settings/source-manager';
import { ActorManager } from '@/components/settings/actor-manager';
import { HiddenNewsManager } from '@/components/settings/hidden-news-manager';

export default function SettingsPage() {
    const { config, addSource, removeSource, addActor, removeActor, unhideNews } = useConfig();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2 text-foreground">Configuración</h2>
                <p className="text-muted-foreground">Gestiona tus fuentes de noticias y los actores que deseas seguir.</p>
            </div>

            <SourceManager
                sources={config.sources}
                onAdd={addSource}
                onRemove={removeSource}
            />

            <ActorManager
                actors={config.actors}
                onAdd={addActor}
                onRemove={removeActor}
            />

            <HiddenNewsManager
                onUnhide={unhideNews}
            />
        </div>
    );
}
