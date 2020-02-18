import * as fs from 'fs';
import * as path from 'path';

import { BASE_DIR, getPackageJson } from '@checkup/core';

import { ProjectType } from '../types';

/**
 * Gets the current type of project, either
 * @param project {IProject} The ember-cli model object, either App, Engine, or Addon.
 * @returns {ProjectType}
 */
export function getProjectType(): ProjectType {
  let pkg = getPackageJson();

  if (pkg.keywords && Array.isArray(pkg.keywords) && pkg.keywords.indexOf('ember-addon') >= 0) {
    if (fs.existsSync(path.join(BASE_DIR, 'addon', 'engine.js'))) {
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
