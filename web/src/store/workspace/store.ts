import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { WorkspaceActionSlice, type WorkspaceAction } from './action';
import { type WorkspaceState, initialState } from './initialState';

//  ===============  聚合 createStoreFn ============ //

export type WorkspaceStore = WorkspaceState & WorkspaceAction;

const createStore: StateCreator<WorkspaceStore, [['zustand/devtools', never]]> = (...parameters) => ({
    ...initialState,
    ...WorkspaceActionSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('global');

export const useWorkspaceStore = createWithEqualityFn<WorkspaceStore>()(
    subscribeWithSelector(devtools(createStore)),
    shallow,
);
