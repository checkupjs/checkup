import { readdirSync } from 'fs';
import { join, parse } from 'path';
import { dirname } from '@checkup/core';
import * as React from 'react';

export const registeredComponents = new Map<string, React.FC>();
const __dirname = dirname(import.meta);

export async function registerDefaultComponents(): Promise<Map<string, React.FC>> {
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
      Object.values(await import(join(__dirname, 'components', component))).pop() as React.FC
    );
  }

  return registeredComponents;
}

await registerDefaultComponents();

export function registerCustomComponent(componentName: string, component: React.FC) {
  registeredComponents.set(componentName, component);
}
