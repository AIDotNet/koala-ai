import { StateCreator } from "zustand";
import { ChatStore } from "./store";


export interface ChatAction {
    setHistory: (history: any[]) => void;
}



export const chatSlice: StateCreator<
  ChatStore,
  [['zustand/devtools', never]],
  [],
  ChatAction
> = (set, get) => ({
    setHistory: (history: any[]) => set({ history }),
})