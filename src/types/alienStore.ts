/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Reducer,
  AnyAction,
  ReducersMapObject,
  ActionCreatorsMapObject,
  ActionFromReducersMapObject,
  StateFromReducersMapObject,
} from 'redux';
import { ValueOf } from './helpers';

// mapped the types of the reducers to produce state's shape type
export type FullStoreShape<T> = {
  [K in keyof T]?: T[K] extends () => any ? ReturnType<T[K]> : never;
};

export type ReducerMapper<U> = Partial<{ [K in keyof Partial<U>]: Reducer<U[K]> }>;

/**
 * Infers state from reducers map object and also its actions
 * @template R object whose keys are reducers functions.
 */
type StateAndActionsFromReducersMapObject<
  R extends ReducersMapObject<any, any>
> = ReducersMapObject<StateFromReducersMapObject<R>, ActionFromReducersMapObject<R>>;

/**
 * A selector is a function that takes a piece of the state and returns it.
 * @template S The type of state consumed by this selector.
 */
export type Selector<S> = (state: S) => ValueOf<S>;

/**
 * Object whose values are selector functions.
 * @template S The type of state given to each selector.
 */
export type SelectorsMapObject<S> = {
  [K: string]: Selector<S>;
};

/**
 * Every piece of the state its considered a Redux module.
 * @template R object whose keys are reducers functions.
 */
export interface ReduxModule<R extends ReducersMapObject<any, any> = ReducersMapObject<any, any>> {
  id: string;
  reducers: StateAndActionsFromReducersMapObject<R>;
  actions: ActionCreatorsMapObject<ActionFromReducersMapObject<R>>;
  selectors?: SelectorsMapObject<StateFromReducersMapObject<R>>;
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
