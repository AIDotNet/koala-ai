import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { type AgentStoreAction, agentActionSlice } from './action';
import { type AgentState, initialState } from './initialState';

//  ===============  聚合 createStoreFn ============ //

export type AgentStore = AgentState & AgentStoreAction;

const createStore: StateCreator<AgentStore, [['zustand/devtools', never]]> = (...parameters) => ({
    ...initialState,
    ...agentActionSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('global');

export const useAgentStore = createWithEqualityFn<AgentStore>()(
    subscribeWithSelector(devtools(createStore)),
    shallow,
);
