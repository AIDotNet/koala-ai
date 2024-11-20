export interface User {
    id: string;
    account: string;
    name: string;
    password: string;
    salt: string;
    avatar: string;
    email: string;
    phone: string;
    introduction: string;
    isDisable: boolean;
}

export interface UserInitializationState{
    avatar?: string;
    canEnablePWAGuide?: boolean;
    canEnableTrace?: boolean;
    hasConversation?: boolean;
    isOnboard?: boolean;
    userId?: string;
}