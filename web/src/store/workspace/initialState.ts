

export interface WorkspaceState {
    workspaces: any[];
    createWorkspaceModalOpen: boolean;
    activeWorkspaceId: number | null;
}

export const initialState: WorkspaceState = {
    workspaces: [],
    activeWorkspaceId: 0,
    createWorkspaceModalOpen: false,
};

