import { readdirSync } from 'fs';
import { join, parse } from 'path';

export const registeredComponents = new Map();

export function registerDefaultComponents(): Record<string, any> {
  let builtInComponents = new Set(
    readdirSync(join(__dirname, 'components')).map((file) => {
      return parse(file).base.split('.')[0];
    })
  );

  for (let component of builtInComponents) {
    registeredComponents.set(
      component,
      Object.values(require(join(__dirname, 'components', component))).pop()
    );
  }

  return registeredComponents;
}

registerDefaultComponents();
