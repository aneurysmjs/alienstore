/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import useLazy from 'uselazy';

// import isNil from './utils/isNil';

import { AlienStore } from './alien';

import errorHandler from './utils/errorHandler';

import { ReduxModule, AlienModule } from './types/alienStore';

function useAlien<T>(reduxImports: Array<() => Promise<ReduxModule<T>>>): Array<AlienModule<T>> {
  const store = useStore() as AlienStore;
  const [alien, setAlien] = useState<Array<AlienModule<T>> | []>([]);
  const { result } = useLazy(reduxImports);
  const {
    alienManager: { register },
  } = store;

  useEffect(() => {
    if (result) {
      try {
        /**
         * Here we cound
         */
        const alienModules = register(result);

        setAlien(prevAlienModules => [...prevAlienModules, ...alienModules]);
      } catch (error) {
        setAlien(error);
      }
    }
  }, [result, store, register]);

  return errorHandler(alien);
}

export default useAlien;
