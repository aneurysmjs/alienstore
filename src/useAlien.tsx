/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import useLazy from 'uselazy';

import { AlienStore } from './alien';

import errorHandler from './utils/errorHandler';

import { ReduxModule, AlienModule } from './types/alienStore';

function useAlien<T>(reduxImports: Array<() => Promise<ReduxModule<T>>>): Array<AlienModule<T>> {
  const store = useStore() as AlienStore;
  const {
    alienManager: { injectReducers, rootReducer },
  } = store;
  const [alien, setAlien] = useState<Array<AlienModule<T>> | []>([]);
  const { result } = useLazy(reduxImports);

  useEffect(() => {
    if (result) {
      try {
        const alienModules = result.map(({ id, reducers, ...rest }) => {
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

        setAlien(prevAlienModules => [...prevAlienModules, ...alienModules]);
      } catch (error) {
        setAlien(error);
      }
    }
  }, [result, store, injectReducers, rootReducer]);

  return errorHandler(alien);
}

export default useAlien;
