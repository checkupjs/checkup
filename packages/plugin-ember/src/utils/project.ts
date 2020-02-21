import * as fs from 'fs';
import * as path from 'path';

import { ProjectType } from '../types';
import { getPackageJson } from '@checkup/core';

/**
 * Gets the current type of project, either
 * @param project {IProject} The ember-cli model object, either App, Engine, or Addon.
 * @returns {ProjectType}
 */
export function getProjectType(basePath: string): ProjectType {
  let pkg = getPackageJson(basePath);

  if (pkg.keywords && Array.isArray(pkg.keywords) && pkg.keywords.indexOf('ember-addon') >= 0) {
    if (fs.existsSync(path.join(process.cwd(), 'addon', 'engine.js'))) {
      return ProjectType.Engine;
    } else {
      return ProjectType.Addon;
    }
  } else if (
    (pkg.dependencies && Object.keys(pkg.dependencies).includes('ember-cli')) ||
    (pkg.devDependencies && Object.keys(pkg.devDependencies).includes('ember-cli'))
  ) {
    return ProjectType.App;
  }

  return ProjectType.Unknown;
}
