import { resolve, join } from 'path';
import { createRequire } from 'module';
import { existsSync, mkdirSync } from 'fs';
import Generator from 'yeoman-generator';
import chalk from 'chalk';
import { extend } from 'lodash';
import { getPackageJson } from '@checkup/core';

const require = createRequire(import.meta.url);
let VERSION = require('../../package.json').version;
export interface Options {
  type: string;
  name: string;
  path: string;
  defaults?: boolean;
  force?: boolean;
}

export const enum Works {
  Everywhere,
  InsidePlugin,
  OutsidePlugin,
  InsideProject,
  OutsideProject,
}

function isInsidePlugin(path: string): boolean {
  try {
    let packageJson = getPackageJson(path);

    return Boolean(packageJson.keywords?.includes('checkup-plugin'));
  } catch {
    return false;
  }
}

function isOutsidePlugin(path: string): boolean {
  try {
    let packageJson = getPackageJson(path);

    return !packageJson.keywords?.includes('checkup-plugin');
  } catch {
    return true;
  }
}

function isOutsideProject(path: string): boolean {
  return !existsSync(join(path, '.checkuprc'));
}

function isInsideProject(path: string): boolean {
  return existsSync(join(path, '.checkuprc'));
}

extend(Generator.prototype, require('yeoman-generator/lib/actions/install'));

export default abstract class GeneratorBase extends Generator {
  abstract works: Works;
  path: string;

  protected get _ext() {
    return this.options.typescript ? 'ts' : 'js';
  }

  protected get _dir() {
    return this.options.typescript ? 'src' : 'lib';
  }

  protected get canRunGenerator() {
    let isValidWorkContext: boolean = false;

    switch (this.works) {
      case Works.InsideProject: {
        isValidWorkContext = isInsideProject(this.path);
        break;
      }

      case Works.OutsideProject: {
        isValidWorkContext = isOutsideProject(this.path);
        break;
      }

      case Works.InsidePlugin: {
        isValidWorkContext = isInsidePlugin(this.path);
        break;
      }

      case Works.OutsidePlugin: {
        isValidWorkContext = isOutsidePlugin(this.path);
        break;
      }

      default: {
        isValidWorkContext = true;
        break;
      }
    }

    return isValidWorkContext;
  }

  constructor(args: string | string[], options: Options) {
    super(args, options);

    this.path = options.path === '.' ? process.cwd() : resolve(options.path);

    if (!existsSync(this.path)) {
      mkdirSync(this.path);
    }

    this.destinationRoot(this.path);
  }

  headline(name: string) {
    this.log(`Generating ${chalk.bold.white(name)} ${chalk.dim(`(checkup v${VERSION})`)}`);
  }
}
