import * as yargs from 'yargs';

export type GenerateOptions = {
  type: string;
  name: string;
  path?: string;
  defaults?: boolean;
  force?: boolean;
} & yargs.Arguments;

export default class GenerateCommand {
  options: GenerateOptions;

  constructor(options: yargs.Arguments) {
    this.options = options as GenerateOptions;
  }

  async run() {
    console.log(this.options);
  }
}
