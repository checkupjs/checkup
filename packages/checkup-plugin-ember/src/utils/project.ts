import * as fs from 'fs';
import * as path from 'path';

import { PackageJson } from 'type-fest';
import { ProjectType } from '../types';

/**
 * Gets the current type of project, either App, Engine, or Addon
 *
 * @returns {ProjectType}
 * @param basePath
 */
export function getProjectType(pkg: PackageJson): ProjectType {
  if (pkg.keywords && Array.isArray(pkg.keywords) && pkg.keywords.includes('ember-addon')) {
    return fs.existsSync(path.join(process.cwd(), 'addon', 'engine.js'))
      ? ProjectType.Engine
      : ProjectType.Addon;
  } else if (
    (pkg.dependencies && Object.keys(pkg.dependencies).includes('ember-cli')) ||
    (pkg.devDependencies && Object.keys(pkg.devDependencies).includes('ember-cli'))
  ) {
    return ProjectType.App;
  }

  return ProjectType.Unknown;
}
