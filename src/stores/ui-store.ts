'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'glass' | 'system';

interface UiState {
    sidebarCollapsed: boolean;
    sidebarMobileOpen: boolean;
    currentTheme: Theme;
    searchOpen: boolean;
    toggleSidebar: () => void;
    setSidebarMobileOpen: (open: boolean) => void;
    setTheme: (theme: Theme) => void;
    setSearchOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            sidebarMobileOpen: false,
            currentTheme: 'system', // Default to system to meet explicit user request
            searchOpen: false,

            toggleSidebar: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

            setSidebarMobileOpen: (open: boolean) =>
                set({ sidebarMobileOpen: open }),

            setTheme: (theme: Theme) => set({ currentTheme: theme }),

            setSearchOpen: (open: boolean) => set({ searchOpen: open }),
        }),
        {
            name: 'ibms-ui-storage',
            partialize: (state) => ({ currentTheme: state.currentTheme, sidebarCollapsed: state.sidebarCollapsed }), // only persist theme and sidebar preference
        }
    )
);
