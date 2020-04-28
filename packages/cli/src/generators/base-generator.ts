import * as Generator from 'yeoman-generator';
import * as chalk from 'chalk';

import { getVersion } from '../helpers/get-version';

export default class GeneratorBase extends Generator {
  headline(name: string) {
    this.log(`Generating ${chalk.bold.white(name)} ${chalk.dim(`(checkup v${getVersion()})`)}`);
  }
}
