import { createStore as createReduxStore, Store, Reducer } from 'redux';

import manager from './core/reducerManager/reducerManager';
import { ReducerManager } from './types/managers';

export interface AlienStore extends Store {
  alienManager: ReducerManager;
}

function alien<R = Reducer, S = undefined>(initialReducer?: R, preloadedState?: S): AlienStore {
  const alienManager = manager(initialReducer);
  const store: AlienStore = createReduxStore(alienManager.rootReducer, preloadedState);
  alienManager.setDispatch(store.dispatch);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  alienManager.setReplaceReducer(store.replaceReducer);
  store.alienManager = alienManager;
  return store;
}

export default alien;
