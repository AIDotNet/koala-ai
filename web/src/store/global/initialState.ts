
export enum SidebarTabKey {
    Welcome = 'welcome',
    About = 'about',
    Docs = 'docs',
}


export interface GlobalState {
    theme: 'auto' | 'light' | 'dark';
    sidebarKey: SidebarTabKey | SidebarTabKey.Welcome;
    workspaceSideExpansion:boolean;
}

export const initialState: GlobalState = {
    theme: localStorage.getItem('theme') as 'auto' | 'light' | 'dark' || 'auto',
    sidebarKey: SidebarTabKey.Welcome,
    workspaceSideExpansion: true
}