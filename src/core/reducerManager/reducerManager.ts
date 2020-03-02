/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { AnyAction, combineReducers, Dispatch, Reducer } from 'redux';

import isNil from '../../utils/isNil';

import { FullStoreShape, ReducerMapper, ReduxModule, AlienModule } from '../../types/alienStore';
import { REDUCER_INJECTED, REDUCER_REMOVED } from '../../types/actionTypes';
import { ReducerManager } from '../../types/managers';

type AlienDispatch = Dispatch<AnyAction> | null;
// interface ReplaceReducer<S> {
//   (nextReducer: Reducer<S, AnyAction>): void;
// }

export default function manager<State>(initialReducers?: State): ReducerManager<State> {
  type StoreShape = FullStoreShape<State>;

  type ReducerMap = ReducerMapper<StoreShape>;

  type AlienReplaceReducer = (nextReducer: Reducer<StoreShape, AnyAction>) => void | null;

  const fallback = (): {} => ({});

  let dispatch: AlienDispatch = null;

  let replaceReducer: AlienReplaceReducer | null = null;

  const reducerMap: ReducerMap = initialReducers ? { ...initialReducers } : {};
  // @ts-ignore "combineReducers" doesn't have that overload match
  let combinedReducer = initialReducers ? combineReducers(reducerMap) : fallback;

  let keysToRemove: Array<string> = [];

  function setDispatch(storeDispatch: Dispatch<AnyAction>): void {
    dispatch = storeDispatch;
  }

  function getReducerMap(): ReducerMap {
    return reducerMap;
  }

  function injectReducers(key: string, reducer: Reducer): void {
    if (!key || reducerMap[key]) {
      return;
    }

    reducerMap[key] = reducer;
    // @ts-ignore "combineReducers" doesn't have that overload match
    combinedReducer = combineReducers(reducerMap);

    if (dispatch) {
      dispatch({ type: REDUCER_INJECTED });
    }
  }

  function removeReducers(key: string): void {
    if (!key || !reducerMap[key]) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`trying to remove a non-existing reducer: ${key}`);
      }
      return;
    }
    delete reducerMap[key];

    if (dispatch) {
      dispatch({ type: REDUCER_REMOVED });
    }

    keysToRemove.push(key);
    // @ts-ignore "combineReducers" doesn't have that overload match
    combinedReducer = combineReducers(reducerMap);
  }

  // this is what we give to create the Redux store
  function rootReducer(state: StoreShape, action: AnyAction): Reducer {
    let tempState = state;
    if (keysToRemove.length > 0) {
      tempState = { ...state };
      for (let i = 0; i < keysToRemove.length; i += 1) {
        delete tempState[keysToRemove[i]];
      }
      keysToRemove = [];
    }

    // Delegate to the combined reducer
    return combinedReducer(state, action);
  }
  // @ts-ignore
  function setReplaceReducer(storeReplaceReducer): void {
    replaceReducer = storeReplaceReducer;
  }

  function register(reduxModules: Array<ReduxModule<State>>): Array<AlienModule<State>> {
    return reduxModules.map(({ id, reducers, ...rest }) => {
      if (id == null || id === '') {
        throw new Error('Redux Module has no id');
      }

      if (isNil(reducers) || Object.keys(reducers).length === 0) {
        throw new Error('Redux Module has no reducers');
      }
      // is safe here to iterate reducers's keys for reducer injection
      Object.keys(reducers).forEach(key => {
        injectReducers(key, reducers[key]);
      });

      if (replaceReducer) {
        // @ts-ignore
        replaceReducer(rootReducer);
      }

      return {
        id,
        ...rest,
      };
    });
  }

  return {
    getReducerMap,
    injectReducers,
    removeReducers,
    rootReducer,
    setDispatch,
    // @ts-ignore
    setReplaceReducer,
    register,
  };
}
