import { readdirSync } from 'fs';
import { join, parse } from 'path';
import * as React from 'react';

export const registeredComponents = new Map<string, React.FC>();

export function registerDefaultComponents(): Map<string, React.FC> {
  let builtInComponents = new Set(
    readdirSync(join(__dirname, 'components')).map((file) => {
      return parse(file).base.split('.')[0];
    })
  );

  for (let component of builtInComponents) {
    registeredComponents.set(
      component,
      Object.values(require(join(__dirname, 'components', component))).pop() as React.FC
    );
  }

  return registeredComponents;
}

registerDefaultComponents();
