/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reducer, ActionCreator, AnyAction } from 'redux';

// get the return value if T is a function
export type Unpack<T> = T extends (...args: any[]) => infer R ? R : any;

// mapped the types of the reducers to produce state's shape type
export type FullStoreShape<T> = {
  [K in keyof T]?: T[K] extends Function ? Unpack<T[K]> : never;
};

export type ReducerMapper<U> = Partial<{ [K in keyof Partial<U>]: Reducer<U[K]> }>;

/**
 * Every piece of the state its considered a Redux module.
 */
export interface ReduxModule<S = any> {
  id: string;
  reducers: {
    [K: string]: Reducer<S>;
  };
  actions: {
    [K: string]: ActionCreator<AnyAction>;
  };
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
