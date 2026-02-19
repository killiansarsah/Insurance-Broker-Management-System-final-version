'use client';

import { create } from 'zustand';

export type Theme = 'gold' | 'glass' | 'compact';

interface UiState {
    sidebarCollapsed: boolean;
    sidebarMobileOpen: boolean;
    currentTheme: Theme;
    toggleSidebar: () => void;
    setSidebarMobileOpen: (open: boolean) => void;
    setTheme: (theme: Theme) => void;
}

export const useUiStore = create<UiState>((set) => ({
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
    currentTheme: 'gold',

    toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    setSidebarMobileOpen: (open: boolean) =>
        set({ sidebarMobileOpen: open }),

    setTheme: (theme: Theme) => set({ currentTheme: theme }),
}));
