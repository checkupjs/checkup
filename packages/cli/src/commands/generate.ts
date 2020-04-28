import * as chalk from 'chalk';
import * as debug from 'debug';

import { basename, join } from 'path';
import { existsSync, readdirSync } from 'fs';

import Command from '@oclif/command';
import { IConfig } from '@oclif/config';
import { createEnv } from 'yeoman-environment';
import { flags } from '@oclif/command';
import { rmdirSync } from 'fs';

export interface Options {
  type: string;
  name: string;
  path: string;
  defaults?: boolean;
  force?: boolean;
}

export default class GenerateCommand extends Command {
  private _generators!: string[];
  private baseDir: string;

  static description = 'Runs a generator to scaffold Checkup code';

  static flags = {
    defaults: flags.boolean({ description: 'use defaults for every setting' }),
    options: flags.string({ description: '(typescript)' }),
    force: flags.boolean({ description: 'overwrite existing files' }),
  };

  static args = [
    {
      name: 'type',
      required: true,
      description: 'type of generator to run (config, plugin, task)',
    },
    {
      name: 'name',
      description: 'name of the entity (kebab-case)',
    },
    {
      name: 'path',
      description: 'The path referring to the directory that the generator will run in',
      default: '.',
    },
  ];

  constructor(argv: string[], config: IConfig) {
    super(argv, config);

    this.baseDir = process.cwd();
    this.debug = debug('checkup:generator');
  }

  get validGenerators() {
    if (!this._generators) {
      this._generators = readdirSync(join(__dirname, '../generators')).map((file) =>
        basename(file, '.ts')
      );
    }

    return this._generators;
  }

  async run() {
    const { flags, args } = this.parse(GenerateCommand);

    this.debug('available generators', this.validGenerators);

    if (!this.validGenerators.includes(args.type)) {
      this.error(
        `No valid generator found for ${chalk.bold.white(
          args.type
        )}. Valid generators are ${chalk.bold.white(this.validGenerators.join(', '))}`
      );
    }

    await this.generate(args.type, {
      name: args.name,
      path: args.path,
      defaults: flags.defaults,
      force: flags.force,
    } as Options);
  }

  async generate(type: string, generatorOptions: object = {}) {
    this.debug('generatorOptions', generatorOptions);

    const env = createEnv();

    env.register(require.resolve(`../generators/${type}`), `checkup:${type}`);

    await new Promise((resolve, reject) => {
      env.run(`checkup:${type}`, generatorOptions, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          // this is ugly, but I couldn't find the correct configuration to ignore
          // generating the yeoman repository directory in the cwd
          let yoRepoPath = join(this.baseDir, '.yo-repository');

          if (existsSync(yoRepoPath)) {
            rmdirSync(yoRepoPath);
          }

          resolve();
        }
      });
    });
  }
}
