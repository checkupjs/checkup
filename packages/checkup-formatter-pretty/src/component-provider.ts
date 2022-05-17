import { readdirSync } from 'fs';
import { join, parse } from 'path';
import { createRequire } from 'module';
import { dirname } from 'dirname-filename-esm';
import * as React from 'react';

export const registeredComponents = new Map<string, React.FC>();

const require = createRequire(import.meta.url);
const __dirname = dirname(import.meta);

export function registerDefaultComponents(): Map<string, React.FC> {
  debugger;
  let builtInComponents = new Set(
    readdirSync(join(__dirname, 'components'), { withFileTypes: true })
      .filter((file) => file.isFile())
      .map((file) => {
        return parse(file.name).base.split('.')[0];
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

export function registerCustomComponent(componentName: string, component: React.FC) {
  registeredComponents.set(componentName, component);
}
