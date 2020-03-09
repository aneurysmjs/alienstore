/* eslint-disable @typescript-eslint/ban-ts-ignore, @typescript-eslint/explicit-function-return-type */
import { AnyAction } from 'redux';

import { reducer1, reducerA, reducerB } from './reducers';

import { ReduxModule } from '~/types/alienStore';

export const reduxModule = {
  id: 'redux-module-id',
  reducers: {
    state1: reducer1,
  },
  actions: {
    dummyAction: (): AnyAction => ({
      type: 'DUMMY_ACTION',
      payload: {
        name: 'Джеро',
      },
    }),
  },
};

export const reduxModuleNoId = {
  reducers: {
    state1: reducer1,
  },
  actions: {
    dummyAction: (): AnyAction => ({
      type: 'DUMMY_ACTION',
      payload: {
        name: 'Джеро',
      },
    }),
  },
};

export const reduxModuleNoReducers = {
  id: 'reduxModuleNoReducers',
  reducers: {},
  actions: {
    dummyAction: (): AnyAction => ({
      type: 'DUMMY_ACTION',
      payload: {
        name: 'Джеро',
      },
    }),
  },
};

interface StateReduxModuleA {
  stateA: string;
}

export const reduxModuleA: ReduxModule<StateReduxModuleA> = {
  id: 'reduxModuleA',
  reducers: {
    stateA: reducerA,
  },
  actions: {
    actionA: (): AnyAction => ({
      type: 'ACTION_A',
      payload: {
        name: 'Джеро',
      },
    }),
  },
  selectors: {
    selectorA: state => state,
  },
};

export const reduxModuleB = {
  id: 'reduxModuleB',
  reducers: {
    stateB: reducerB,
  },
  actions: {
    actionB: (): AnyAction => ({
      type: 'ACTION_B',
      payload: {
        name: 'Джеро',
      },
    }),
  },
  selectors: {
    // @ts-ignore
    selectorB: ({ sliceA }) => sliceA,
  },
};

export const modules = [reduxModuleA, reduxModuleB];
