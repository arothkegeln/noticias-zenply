"use client";

import { useContext } from 'react';
import { ConfigContext } from '@/components/config-provider';

export function useConfig() {
    const context = useContext(ConfigContext);

    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }

    return context;
}

// Re-export types for backward compatibility if needed, 
// though ideally they should be imported from @/types or @/components/config-provider
export type { AppConfig, HiddenNews } from '@/components/config-provider';
