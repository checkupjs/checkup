import * as Generator from 'yeoman-generator';
import * as chalk from 'chalk';

import { Options } from '../commands/generate';

import { getVersion } from '../utils/get-version';
import { resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

export default class GeneratorBase extends Generator {
  protected get _ext() {
    return this.options.typescript ? 'ts' : 'js';
  }

  constructor(args: string | string[], options: Options) {
    super(args, options);

    if (options.path && options.path !== '.') {
      let resolvedPath = resolve(options.path);

      if (!existsSync(resolvedPath)) {
        mkdirSync(resolvedPath);
      }

      this.destinationRoot(resolvedPath);
    }
  }

  headline(name: string) {
    this.log(`Generating ${chalk.bold.white(name)} ${chalk.dim(`(checkup v${getVersion()})`)}`);
  }
}
