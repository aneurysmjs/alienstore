/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { AnyAction, combineReducers, Dispatch, Reducer } from 'redux';

import { FullStoreShape, ReducerMapper } from '../../types/alienStore';
import { ReducerManager } from '../../types/managers';

type AlienDispatch = Dispatch<AnyAction> | null;

export default function manager<State>(initialReducers?: State): ReducerManager<State> {
  type StoreShape = FullStoreShape<State>;

  type ReducerMap = ReducerMapper<StoreShape>;

  const fallback = (): {} => ({});

  let dispatch: AlienDispatch = null;

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

  function injectReducers(key: string, reducer: Reducer): Reducer | void {
    if (!key || reducerMap[key]) {
      return;
    }

    reducerMap[key] = reducer;
    // @ts-ignore "combineReducers" doesn't have that overload match
    combinedReducer = combineReducers(reducerMap);
    if (dispatch) {
      dispatch({ type: '@@ALIEN_STORE/RELOAD' });
    }
  }

  function removeReducers(key: string): void {
    if (!key || !reducerMap[key]) {
      return;
    }

    delete reducerMap[key];

    keysToRemove.push(key);
    // @ts-ignore "combineReducers" doesn't have that overload match
    combinedReducer = combineReducers(reducerMap);
  }

  // this is what we give to create the Redux store
  function rootReducer(state: StoreShape, action: AnyAction): Reducer {
    let tempState = state;
    if (keysToRemove.length > 0) {
      tempState = { ...state };
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < keysToRemove.length; i += 1) {
        delete tempState[keysToRemove[i]];
      }
      keysToRemove = [];
    }

    // Delegate to the combined reducer
    return combinedReducer(state, action);
  }

  return {
    getReducerMap,
    injectReducers,
    removeReducers,
    rootReducer,
    setDispatch,
  };
}
