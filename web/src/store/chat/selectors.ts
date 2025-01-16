import { ChatState } from "./initialState"

const getMessageById = (s: ChatState, id: number) => {
    return s.history.find((item) => item.id === id)
}

const isCurrentChatLoaded = (s:ChatState) => {
    return s.currentLoadedId
}

const currentChatKey = (s:ChatState) => {
    return s.agentId
}

const chatSelectors  = {
    getMessageById,
    currentChatKey,
    isCurrentChatLoaded
}

export {
    chatSelectors
}