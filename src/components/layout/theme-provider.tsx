'use client';

import { useEffect } from 'react';
import { useUiStore } from '@/stores/ui-store';

export function ThemeProvider() {
    const { currentTheme } = useUiStore();

    useEffect(() => {
        const root = document.documentElement;

        // Remove existing theme classes
        root.classList.remove('theme-gold', 'theme-glass', 'theme-compact');

        // Add new theme class
        root.classList.add(`theme-${currentTheme}`);

    }, [currentTheme]);

    return null;
}
