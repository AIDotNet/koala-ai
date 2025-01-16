import { ChatState } from "./initialState"

const getMessageById = (s: ChatState, id: number) => {
    const message = s.history.findIndex((item) => item.id === id)
    return s.history[message]
}

const isCurrentChatLoaded = (s:ChatState) => {
    return s.currentLoadedId
}

const currentChatKey = (s:ChatState) => {
    return s.agentId
}

const getMessageIds = (s:ChatState) => {
    return s.history.map((item) => item.id)
}

const isMessageEditing = (s:ChatState,id:number) => {
    return s.editIds.includes(id)
}

const isMessageGenerating = (s:ChatState,id:number) => {
    return s.generatingIds.includes(id)
}

const isMessageLoading = (s:ChatState,id:number) => {
    return s.loadingIds.includes(id)
}

const isAIGenerating = (s:ChatState) => {
    return s.generating
}

const chatSelectors  = {
    getMessageById,
    currentChatKey,
    isCurrentChatLoaded,
    getMessageIds,
    isMessageEditing,
    isMessageGenerating,
    isMessageLoading,
    isAIGenerating,
}

export {
    chatSelectors
}