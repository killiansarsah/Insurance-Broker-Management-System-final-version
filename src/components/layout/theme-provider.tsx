'use client';

import { useEffect } from 'react';
import { useUiStore } from '@/stores/ui-store';

export function ThemeProvider() {
    const { currentTheme } = useUiStore();

    useEffect(() => {
        const root = document.documentElement;

        // Remove all theme classes before applying the new one
        root.classList.remove('theme-light', 'theme-dark', 'theme-glass', 'theme-gold', 'theme-compact');

        // Add new theme class
        root.classList.add(`theme-${currentTheme}`);

    }, [currentTheme]);

    return null;
}
