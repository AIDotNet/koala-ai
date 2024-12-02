
export interface AgentState {
    agent: any[];
    total: number;
    inputAgent: {
        keyword?: string;
        page: number;
        pageSize: number;
    };
    createAgentModalOpen: boolean;
}

export const initialState: AgentState = {
    agent: [],
    total: 0,
    inputAgent: {
        keyword: '',
        page: 1,
        pageSize: 10,
    },
    createAgentModalOpen: false,
}
