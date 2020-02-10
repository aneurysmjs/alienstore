import { useEffect, useState } from 'react';
import { Reducer, AnyAction, ActionCreator } from 'redux';
import { useStore } from 'react-redux';

import { AlienStore } from './alien';

export interface ReduxModule<S = {}> {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AlienModule<S = any> = Omit<ReduxModule<S>, 'reducers'>;

function errorHandler<T>(errorOrObj: T): T {
  if (errorOrObj) {
    // rejection from `import()` for some reason is not and instance of Error
    // that's why the "Object.getPrototypeOf(errorOrObj).name"
    if (errorOrObj instanceof Error || Object.getPrototypeOf(errorOrObj).name === 'Error') {
      throw new Error(`useAlienModule ${errorOrObj}`);
    }
  }
  return errorOrObj;
}

function useAlien<T>(
  reduxImports: Array<() => Promise<ReduxModule<T>>>,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  cb: () => void = () => {},
): Array<AlienModule<T>> {
  const store = useStore() as AlienStore;
  const {
    alienManager: { injectReducers, rootReducer },
  } = store;
  const [alien, setAlien] = useState<Array<AlienModule<T>> | []>([]);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const promises = reduxImports.map(reduxImport => reduxImport());

        const reduxModules = await Promise.all(promises);

        const result = reduxModules.map(({ id, reducers, ...rest }) => {
          if (id == null || id === '') {
            throw new Error('Redux Module has no id');
          }

          if (reducers == null || reducers === undefined || Object.keys(reducers).length === 0) {
            throw new Error('Redux Module has no reducers');
          }
          // is safe here to iterate reducers's keys for reducer injection
          Object.keys(reducers).forEach(key => {
            injectReducers(key, reducers[key]);
          });

          store.replaceReducer(rootReducer);

          return {
            id,
            ...rest,
          };
        });

        setAlien([...alien, ...result]);
      } catch (err) {
        setAlien(err);
      }
    })();

    return (): void => cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return errorHandler(alien);
}

export default useAlien;
