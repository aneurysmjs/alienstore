import React, { ReactElement, ComponentType } from 'react';

import useAlien, { AlienModule, ReduxModule } from './useAlien';

interface WithAlienProps {
  modules: Array<AlienModule>;
}

function WithAlien<P extends object>(
  Component: ComponentType<P>,
  reduxModules: Array<() => Promise<ReduxModule<P>>>,
): ReactElement<P & WithAlienProps> | null {
  const AlienModule = useAlien(reduxModules);

  if (AlienModule.length > 0) {
    return <Component {...({ modules: AlienModule } as P)} />;
  }

  return null;
}

export default WithAlien;
