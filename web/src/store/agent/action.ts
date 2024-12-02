import { StateCreator } from "zustand";
import { AgentStore } from "./store";
import { fetchAgents } from "@/services/AgentService";

export interface AgentStoreAction{
    loadAgent: (workspaceId: number) => Promise<void>;
    setCreateAgentModalOpen: (open: boolean) => void;
}


export const agentActionSlice: StateCreator<
AgentStore,
[['zustand/devtools', never]],
[],
AgentStoreAction> = (set, get) => ({
    loadAgent: async (workspaceId: number) => {
        const input = {
            ...get().inputAgent,
            workspaceId,
        }
        const result = await fetchAgents(input.workspaceId, input.page, input.pageSize, input.keyword);
        set((state) => ({
            ...state,
            agent: result.data.data,
            total: result.data.total,
        }));
    },
    setCreateAgentModalOpen: (open: boolean) => {
        set((state) => ({
            ...state,
            createAgentModalOpen: open,
        }));
    },
});