"use client";

import { useEffect, useState } from 'react';

export default function DebugPage() {
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        const data = localStorage.getItem('zenply-news-config');
        if (data) {
            setConfig(JSON.parse(data));
        }
    }, []);

    const clearAll = () => {
        localStorage.removeItem('zenply-news-config');
        window.location.reload();
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-zinc-100">Debug - LocalStorage</h1>

            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                <h2 className="text-lg font-semibold mb-2 text-zinc-200">Configuración Actual:</h2>
                <pre className="text-xs text-zinc-400 overflow-auto">
                    {JSON.stringify(config, null, 2)}
                </pre>
            </div>

            <button
                onClick={clearAll}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
                Limpiar Todo y Recargar
            </button>

            <div className="text-sm text-zinc-500">
                <p>Fuentes configuradas: {config?.sources?.length || 0}</p>
                <p>Actores configurados: {config?.actors?.length || 0}</p>
            </div>
        </div>
    );
}
