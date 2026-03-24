'use client';

import { useEffect, useState } from 'react';
import { useUiStore } from '@/stores/ui-store';

export function ThemeProvider() {
    const { currentTheme } = useUiStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;

        const applyThemeClass = (theme: string) => {
            root.classList.remove('theme-light', 'theme-dark', 'theme-glass', 'theme-gold', 'theme-compact');
            root.classList.add(`theme-${theme}`);
            
            // For general tailwind dark mode compatibility 
            if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        if (currentTheme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            applyThemeClass(mediaQuery.matches ? 'dark' : 'light');

            const handleChange = (e: MediaQueryListEvent) => {
                applyThemeClass(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            applyThemeClass(currentTheme);
        }
    }, [currentTheme, mounted]);

    return null;
}
