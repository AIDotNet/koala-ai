import { SidebarTabKey } from "./initialState";
import type { StateCreator } from 'zustand/vanilla';

export interface GlobalStoreAction {
    switchTheme: (theme: 'auto' | 'light' | 'dark') => void;
    switchSidebar: (sidebarTabKey: SidebarTabKey) => void;
}

export const globalActionSlice: StateCreator<GlobalStoreAction> = (set, get) => ({
    switchTheme: (theme) => {
        set((state) => ({
            ...state,
            theme,
        }));
        localStorage.setItem('theme', theme);
    },
    switchSidebar: (sidebarTabKey) => {
        set((state) => ({
            ...state,
            sidebarKey: sidebarTabKey,
        }));
    },
});