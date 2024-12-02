import { StateCreator } from "zustand";
import { WorkspaceStore } from "./store";
import { getWorkspaces } from "@/services/WorkspacesService";

export interface WorkspaceAction {
    setWorkspaces: (workspaces: any[]) => void;
    setCreateWorkspaceModalOpen: (open: boolean) => void;
    loadWorkspaces: () => Promise<void>;
    setActiveWorkspaceId: (id: number) => void;
}


export const WorkspaceActionSlice: StateCreator<
    WorkspaceStore,
    [['zustand/devtools', never]],
    [],
    WorkspaceAction> = (set, get) => ({
        setWorkspaces: (workspaces) => {
            set((state) => ({
                ...state,
                workspaces,
            }));
        },
        setCreateWorkspaceModalOpen: (open) => {
            set((state) => ({
                ...state,
                createWorkspaceModalOpen: open,
            }));
        },
        loadWorkspaces: async () => {
            const workspaces = await getWorkspaces();
            set((state) => ({
                ...state,
                workspaces: workspaces.data,
            }));
        },
        setActiveWorkspaceId: (id) => {
            set((state) => ({
                ...state,
                activeWorkspaceId: id,
            }));
        },
    });