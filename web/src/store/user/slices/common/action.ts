import useSWR, { SWRResponse, mutate } from 'swr';
import type { StateCreator } from 'zustand/vanilla';
import { useOnlyFetchOnceSWR } from '@/libs/swr';
import type { UserStore } from '@/store/user';
import { UserInitializationState } from '@/types/user';

const GET_USER_STATE_KEY = 'initUserState';
/**
 * 设置操作
 */
export interface CommonAction {
    refreshUserState: () => Promise<void>;
    updateAvatar: (avatar: string) => Promise<void>;
    useCheckTrace: (shouldFetch: boolean) => SWRResponse;
    useInitUserState: (
        isLogin: boolean | undefined,
        options?: {
            onSuccess: (data: UserInitializationState) => void;
        },
    ) => SWRResponse;
}

export const createCommonSlice: StateCreator<
    UserStore,
    [['zustand/devtools', never]],
    [],
    CommonAction
> = (set, get) => ({
    refreshUserState: async () => {
        await mutate(GET_USER_STATE_KEY);
    },
    updateAvatar: async (avatar) => {

    },

    useCheckTrace: (shouldFetch) =>
        useSWR<boolean>(
            shouldFetch ? 'checkTrace' : null,
            () => {
                return Promise.resolve(get().isUserCanEnableTrace);
            },
            {
                revalidateOnFocus: false,
            },
        ),

    useInitUserState: (isLogin, options) =>
        useOnlyFetchOnceSWR<UserInitializationState>(
            !!isLogin ? GET_USER_STATE_KEY : null,
            {
                onSuccess: (data: any) => {
                    options?.onSuccess?.(data);
                },
            },
        ),
});
