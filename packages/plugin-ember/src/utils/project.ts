import * as fs from 'fs';
import * as path from 'path';

import { ProjectType } from '../types';
import { getPackageJson } from '@checkup/core';

/**
 * Gets the current type of project, either App, Engine, or Addon
 *
 * @returns {ProjectType}
 */
export function getProjectType(basePath: string): ProjectType {
  let package_ = getPackageJson(basePath);

  if (
    package_.keywords &&
    Array.isArray(package_.keywords) &&
    package_.keywords.includes('ember-addon')
  ) {
    if (fs.existsSync(path.join(process.cwd(), 'addon', 'engine.js'))) {
      return ProjectType.Engine;
    } else {
      return ProjectType.Addon;
    }
  } else if (
    (package_.dependencies && Object.keys(package_.dependencies).includes('ember-cli')) ||
    (package_.devDependencies && Object.keys(package_.devDependencies).includes('ember-cli'))
  ) {
    return ProjectType.App;
  }

  return ProjectType.Unknown;
}
