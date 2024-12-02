import { StateCreator } from "zustand";
import { WorkspaceStore } from "./store";
import { deleteWorkspace, getWorkspaces, updateWorkspace } from "@/services/WorkspacesService";
import { message } from "antd";

export interface WorkspaceAction {
    setWorkspaces: (workspaces: any[]) => void;
    setCreateWorkspaceModalOpen: (open: boolean) => void;
    loadWorkspaces: () => Promise<void>;
    setActiveWorkspaceId: (id: number) => void;
    setWorkspaceName: (id: number, name: string, complete?: boolean) => Promise<void>;
    setWorkspaceEditable: (id: number, editable: boolean) => void;
    deleteWorkspace: (id: number) => Promise<void>;
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
        setWorkspaceName: async (id, name, complete) => {

            if (complete) {
                if (name.length > 10) {
                    message.error('名称长度不能超过10个字符');
                    return;
                }

                if (name.length === 0) {
                    message.error('名称不能为空');
                    return;
                }

                const workspaces = get().workspaces.map((workspace) => workspace.id === id ? { ...workspace, name, editable: false } : workspace);

                const workspace = workspaces.find((workspace) => workspace.id === id);


                await updateWorkspace(id, workspace);
                message.success('更新成功');
                set((state) => ({
                    ...state,
                    workspaces: workspaces
                }));
            } else {
                const workspaces = get().workspaces.map((workspace) => workspace.id === id ? { ...workspace, name } : workspace);

                set((state) => ({
                    ...state,
                    workspaces: workspaces
                }));
            }
        },
        setWorkspaceEditable: (id, editable) => {
            set((state) => ({
                ...state,
                workspaces: state.workspaces.map((workspace) => workspace.id === id ? { ...workspace, editable } : workspace),
            }));
        },
        deleteWorkspace: async (id) => {
            var result = await deleteWorkspace(id);
            if (result.success) {
                
                message.success('删除成功');
                set((state) => ({
                ...state,
                    workspaces: state.workspaces.filter((workspace) => workspace.id !== id),
                }));
            } else {
                message.error(result.message);
            }
        }
    });