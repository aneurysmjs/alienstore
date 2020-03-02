import { AnyAction, Dispatch, Reducer } from 'redux';

import {
  FullStoreShape,
  ReducerMapper,
  ReduxModule,
  AlienModule,
  ReplaceReducer,
} from './alienStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ReducerManager<R = any> {
  getReducerMap: () => ReducerMapper<FullStoreShape<R>>;
  injectReducers: (key: string, reducer: Reducer) => Reducer | void;
  removeReducers: (key: string) => void;
  rootReducer: Reducer;
  setDispatch: (storeDispatch: Dispatch<AnyAction>) => void;
  setReplaceReducer: (storeReplaceReducer: ReplaceReducer) => void;
  register: (reduxModules: Array<ReduxModule<R>>) => Array<AlienModule<R>>;
}
