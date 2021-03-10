import * as debug from 'debug';
import { extendedError } from '../extended-error';
import { CheckupError } from '@checkup/core';
import chalk from 'chalk';
import { createEnv } from 'yeoman-environment';
import { join } from 'path';
import { existsSync, rmdirSync } from 'fs-extra';

export type GenerateOptions = {
  generator: string;
  name: string;
  path: string;
  defaults?: boolean;
};

const VALID_GENERATORS = ['config', 'plugin', 'task', 'actions'];

export default class Generator {
  options: GenerateOptions;
  debug: debug.Debugger;

  constructor(options: GenerateOptions) {
    this.options = options;
    this.debug = debug('checkup:generator');
  }

  async run() {
    this.debug('available generators', VALID_GENERATORS);

    if (!VALID_GENERATORS.includes(this.options.generator)) {
      extendedError(
        new CheckupError(
          `No valid generator found for ${chalk.bold.white(this.options.generator)}`,
          `Valid generators are ${chalk.bold.white(VALID_GENERATORS.join(', '))}`
        )
      );
    }

    await this.generate(this.options.generator, {
      name: this.options.name,
      path: this.options.path === '.' ? process.cwd() : this.options.path,
      defaults: this.options.defaults,
    } as GenerateOptions);
  }

  async generate(type: string, generatorOptions: GenerateOptions) {
    this.debug('generatorOptions', generatorOptions);

    const env = createEnv();

    env.register(require.resolve(`../generators/${type}`), `checkup:${type}`);

    try {
      await new Promise((resolve, reject) => {
        env.run(`checkup:${type}`, generatorOptions, (err: Error | null) => {
          if (err) {
            reject(err);
          } else {
            // this is ugly, but I couldn't find the correct configuration to ignore
            // generating the yeoman repository directory in the cwd
            let yoRepoPath = join(this.options.path, '.yo-repository');

            if (existsSync(yoRepoPath)) {
              rmdirSync(yoRepoPath);
            }

            resolve();
          }
        });
      });
    } catch (error) {
      if (!(error instanceof CheckupError)) {
        // eslint-disable-next-line no-ex-assign
        error = new CheckupError(`Could not run the ${type} generator.`, error.message);
      }
      extendedError(error);
    }
  }
}
