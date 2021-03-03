import * as yargs from 'yargs';

export type RunOptions = {
  version: void;
  help: void;
  config?: string;
  cwd: string;
  category?: string[];
  group?: string[];
  task?: string[];
  'list-tasks': boolean;
  format: string;
  'output-file': string;
  'exclude-paths'?: string[];
  verbose: boolean;
} & yargs.Arguments;

export default class RunCommand {
  options: RunOptions;

  constructor(options: yargs.Arguments) {
    this.options = options as RunOptions;
  }

  async run() {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    return {
      message: 'I ran',
    };
  }
}
