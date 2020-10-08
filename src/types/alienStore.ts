/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Reducer,
  AnyAction,
  ReducersMapObject,
  ActionCreatorsMapObject,
  ActionFromReducersMapObject,
  StateFromReducersMapObject,
} from 'redux';

// mapped the types of the reducers to produce state's shape type
export type FullStoreShape<T> = {
  [K in keyof T]?: T[K] extends () => any ? ReturnType<T[K]> : never;
};

export type ReducerMapper<U> = Partial<{ [K in keyof Partial<U>]: Reducer<U[K]> }>;

/**
 * Every piece of the state its considered a Redux module.
 */
export interface ReduxModule<R extends ReducersMapObject<any, any> = ReducersMapObject<any, any>> {
  id: string;
  reducers: ReducersMapObject<StateFromReducersMapObject<R>, ActionFromReducersMapObject<R>>;
  actions: ActionCreatorsMapObject<ActionFromReducersMapObject<R>>;
  selectors?: {
    [K: string]: <S, R>(state: S) => R;
  };
}

/**
 * This is what a React component receives in its props to start interacting
 * with Redux store, by dispatching actions or retreiving slices of the state
 * with the help of selectors.
 */
export type AlienModule<S = any> = Omit<ReduxModule<S>, 'reducers'>;

export interface ReplaceReducer<S = any> {
  (nextReducer: Reducer<S, AnyAction>): void;
}
