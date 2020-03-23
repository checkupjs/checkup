import Command from '@oclif/command';
import { createEnv } from 'yeoman-environment';
import { flags } from '@oclif/command';

export interface Options {
  type: string;
  name: string;
  path: string;
  defaults?: boolean;
  force?: boolean;
}

export default class GenerateCommand extends Command {
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
      required: true,
      description: 'name of the entity (kebab-case)',
    },
    {
      name: 'path',
      required: true,
      description: 'The path referring to the directory that the generator will run in',
      default: '.',
    },
  ];

  async run() {
    const { flags, args } = this.parse(GenerateCommand);

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
