import React, { ReactElement, ComponentType } from 'react';

import useAlien from './useAlien';
import { ReduxModule, AlienModule } from './types/alienStore';

interface WithAlienProps {
  modules: Array<AlienModule>;
}

function WithAlien<P extends object>(
  Component: ComponentType<P>,
  reduxModules: Array<() => Promise<ReduxModule<P>>>,
): ReactElement<P & WithAlienProps> | null {
  const alienModules = useAlien(reduxModules);

  if (alienModules.length > 0) {
    return <Component {...({ modules: alienModules } as P)} />;
  }

  return null;
}

export default WithAlien;
