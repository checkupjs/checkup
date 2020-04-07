import * as chalk from 'chalk';

import { basename, join } from 'path';

import Command from '@oclif/command';
import { createEnv } from 'yeoman-environment';
import { flags } from '@oclif/command';
import { readdirSync } from 'fs';

export interface Options {
  type: string;
  name: string;
  path: string;
  defaults?: boolean;
  force?: boolean;
}

export default class GenerateCommand extends Command {
  private _generators!: string[];

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
      description: 'type of generator to run (task, plugin)',
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
    const env = createEnv();

    env.register(require.resolve(`../generators/${type}`), `checkup:${type}`);

    await new Promise((resolve, reject) => {
      env.run(`checkup:${type}`, generatorOptions, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
