
export interface ChatState {
    history: any[];
    generating: boolean;
    editIds: number[];
    currentLoadedId: boolean;
    agentId: string;
}

export const initialState: ChatState = {
    history: [
    ],
    generating: false,
    editIds: [],
    currentLoadedId: false,
    agentId: ''
}
