import { AnyAction, Dispatch, Reducer } from 'redux';

import { FullStoreShape, ReducerMapper } from './alienStore';

export interface ReducerManager<R = {}> {
  getReducerMap: () => ReducerMapper<FullStoreShape<R>>;
  injectReducers: (key: string, reducer: Reducer) => Reducer | void;
  removeReducers: (key: string) => void;
  rootReducer: Reducer;
  setDispatch: (storeDispatch: Dispatch<AnyAction>) => void;
}
