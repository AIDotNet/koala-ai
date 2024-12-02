import { SidebarTabKey } from "./initialState";
import type { StateCreator } from 'zustand/vanilla';
import { GlobalStore } from './store';

export interface GlobalStoreAction {
    switchTheme: (theme: 'auto' | 'light' | 'dark') => void;
    switchSidebar: (sidebarTabKey: SidebarTabKey) => void;
    switchWorkspaceSideExpansion: () => void;
}

export const globalActionSlice: StateCreator<
GlobalStore,
[['zustand/devtools', never]],
[],
GlobalStoreAction> = (set, get) => ({
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
    switchWorkspaceSideExpansion:()=>{
        set((state) => ({
            ...state,
            workspaceSideExpansion: !get().workspaceSideExpansion
        }));
    }
});