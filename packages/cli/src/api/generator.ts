import { join } from 'path';
import * as debug from 'debug';
import { CheckupError, ErrorKind } from '@checkup/core';
import yeomanEnv from 'yeoman-environment';
import fs from 'fs-extra';

export type GenerateOptions = {
  generator: string;
  name: string;
  path: string;
  defaults?: boolean;
};

const { existsSync, rmdirSync } = fs;
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
      throw new CheckupError(ErrorKind.GeneratorNotFound);
    }

    await this.generate(this.options.generator, {
      name: this.options.name,
      path: this.options.path === '.' ? process.cwd() : this.options.path,
      defaults: this.options.defaults,
    } as GenerateOptions);
  }

  async generate(type: string, generatorOptions: GenerateOptions) {
    this.debug('generatorOptions', generatorOptions);

    const env = yeomanEnv.createEnv();

    env.register(require.resolve(`../generators/${type}`), `checkup:${type}`);

    try {
      // @ts-ignore
      await env.run(`checkup:${type}`, generatorOptions, null);
      // this is ugly, but I couldn't find the correct configuration to ignore
      // generating the yeoman repository directory in the cwd
      let yoRepoPath = join(this.options.path, '.yo-repository');

      if (existsSync(yoRepoPath)) {
        rmdirSync(yoRepoPath);
      }
    } catch (error: unknown) {
      if (error instanceof CheckupError) {
        throw error;
      }

      throw new CheckupError(ErrorKind.Unknown, { error: error as Error });
    }
  }
}
