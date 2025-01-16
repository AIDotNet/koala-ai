import { StateCreator } from "zustand";
import { ChatState, initialState } from "./initialState";
import { createDevtools } from "../middleware/createDevtools";
import { ChatAction, chatSlice } from "./action";
import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";


export interface ChatStoreAction
    extends ChatState { }

export type ChatStore = ChatStoreAction & ChatState & ChatAction;

const createStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (...params) => ({
    ...initialState,
    ...chatSlice(...params)
});

//  ===============  实装 useStore ============ //
const devtools = createDevtools('chat');

export const useChatStore = createWithEqualityFn<ChatStore>()(
    subscribeWithSelector(devtools(createStore)),
    shallow,
);
