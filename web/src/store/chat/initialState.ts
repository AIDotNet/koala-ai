
export interface ChatState {
    history: any[];
    generating: boolean;
    editIds: number[];
    currentLoadedId: boolean;
    agentId: string;
    generatingIds: number[];
    loadingIds: number[];
    inputMessage: string;
}

export const initialState: ChatState = {
    history: [  {
        content: 'dayjs 如何使用 fromNow',
        createAt: 1_686_437_950_084,
        extra: {},
        id: '1',
        meta: {
          avatar: 'https://avatars.githubusercontent.com/u/17870709?v=4',
          title: 'CanisMinor',
        },
        role: 'user',
        updateAt: 1_686_437_950_084,
      },
    ],
    generating: false,
    editIds: [],
    currentLoadedId: true,
    agentId: '',
    generatingIds: [],
    loadingIds: [],
    inputMessage: '',
}
