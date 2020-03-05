/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createStore, Reducer } from 'redux';

import manager from './reducerManager';

import { initialReducer, reducer1, reducer2, reducerA, reducerB } from '~/utils/reducers';
import { modules } from '~/utils/modules';

import { REDUCER_INJECTED, REDUCER_REMOVED } from '~/types/actionTypes';
import { ReducerManager } from '~/types/managers';

describe('manager', () => {
  it('should return an alienManager', () => {
    const alienManager = manager();
    expect(alienManager).toHaveProperty('getReducerMap');
    expect(alienManager).toHaveProperty('injectReducers');
    expect(alienManager).toHaveProperty('removeReducers');
    expect(alienManager).toHaveProperty('rootReducer');
    expect(alienManager).toHaveProperty('setDispatch');
    expect(alienManager).toHaveProperty('setReplaceReducer');
    expect(alienManager).toHaveProperty('register');
  });

  describe('getReducerMap', () => {
    it('should return empty object if no reducers has been passed', () => {
      const { getReducerMap } = manager();
      const reducerMap = getReducerMap();

      expect(reducerMap).toStrictEqual({});
    });

    it('should return an initilized reducer', () => {
      const { getReducerMap } = manager(initialReducer);
      const reducerMap = getReducerMap();

      expect(reducerMap).toStrictEqual(initialReducer);
    });
  });

  describe('injectReducers', () => {
    let alienManager = {} as ReducerManager;

    beforeEach(() => {
      alienManager = manager();
    });

    it('should inject a new reducer', () => {
      const actionsDispatched: Array<string> = [];

      // hijack 'dispatch' to track actions calls
      alienManager.setDispatch(action => {
        actionsDispatched.push(action.type);
        return action.payload || null;
      });

      const { getReducerMap, injectReducers } = alienManager;
      const initReducerMap = getReducerMap();

      expect(initReducerMap).toStrictEqual({});

      injectReducers('reducer1', reducer1);

      const reducerMap = getReducerMap();

      expect(reducerMap).toStrictEqual({
        reducer1,
      });

      injectReducers('reducer2', reducer2);

      const finalReducerMap = getReducerMap();

      expect(finalReducerMap).toStrictEqual({
        reducer1,
        reducer2,
      });

      expect(actionsDispatched).toEqual([REDUCER_INJECTED, REDUCER_INJECTED]);
    });
  });

  describe('removeReducers', () => {
    const someInitialReducer = {
      state1: reducer1,
      state2: reducer2,
    };

    let alienManager = {} as ReducerManager<typeof someInitialReducer>;

    beforeEach(() => {
      alienManager = manager(someInitialReducer);
    });

    it('should remove a reducer based on its key', () => {
      const actionsDispatched: Array<string> = [];

      alienManager.setDispatch(action => {
        actionsDispatched.push(action.type);
        return action.payload || null;
      });

      const { getReducerMap, removeReducers } = alienManager;
      const reducerMap = getReducerMap();

      expect(reducerMap).toStrictEqual(someInitialReducer);

      removeReducers('state1');

      expect(reducerMap).toStrictEqual({ state2: reducer2 });

      removeReducers('state2');

      expect(reducerMap).toStrictEqual({});

      expect(actionsDispatched).toEqual([REDUCER_REMOVED, REDUCER_REMOVED]);
    });

    it('should not remove a reducer if the key does not exist on the reducerMap', () => {
      const { getReducerMap, removeReducers } = alienManager;
      const reducerMap = getReducerMap();

      expect(reducerMap).toStrictEqual(someInitialReducer);

      removeReducers('notExistingKey');

      expect(reducerMap).toStrictEqual(someInitialReducer);
    });
  });

  describe('setDispatch', () => {
    it("should set a Store's dispatcher for internal use", () => {
      const store = createStore(() => {});
      const alienManager = manager();
      const setDispatchSpy = jest.spyOn(alienManager, 'setDispatch');

      alienManager.setDispatch(store.dispatch);
      expect(setDispatchSpy).toHaveBeenCalledWith(store.dispatch);
    });
  });

  describe('setReplaceReducer', () => {
    it('should set a Redux dispatcher for internal use', () => {
      const store = createStore(() => {});
      const alienManager = manager();
      const setReplaceReducerSpy = jest.spyOn(alienManager, 'setReplaceReducer');

      alienManager.setReplaceReducer(store.replaceReducer);
      expect(setReplaceReducerSpy).toHaveBeenCalledWith(store.replaceReducer);
    });
  });

  describe('register', () => {
    let alienManager = {} as ReducerManager;

    beforeEach(() => {
      alienManager = manager();
    });
    it('should inject reducers for each redux module in the array', () => {
      const replaceReducerCalls: Array<Reducer> = [];

      alienManager.setReplaceReducer(reducer => {
        replaceReducerCalls.push(reducer);
      });

      const actionsDispatched: Array<string> = [];

      alienManager.setDispatch(action => {
        actionsDispatched.push(action.type);
        return action.payload || null;
      });

      const { register, getReducerMap, rootReducer } = alienManager;

      // @ts-ignore
      register(modules);

      const reducerMap = getReducerMap();

      expect(reducerMap).toStrictEqual({ stateA: reducerA, stateB: reducerB });
      expect(replaceReducerCalls).toStrictEqual([rootReducer, rootReducer]);

      expect(actionsDispatched).toEqual([REDUCER_INJECTED, REDUCER_INJECTED]);
    });
  });
});
