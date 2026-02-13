'use client';

import { create } from 'zustand';

interface UiState {
    sidebarCollapsed: boolean;
    sidebarMobileOpen: boolean;
    toggleSidebar: () => void;
    setSidebarMobileOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
    sidebarCollapsed: false,
    sidebarMobileOpen: false,

    toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    setSidebarMobileOpen: (open: boolean) =>
        set({ sidebarMobileOpen: open }),
}));
