import * as chalk from 'chalk';

import BaseGenerator, { Works } from './base-generator';
import { writeConfig, CheckupError } from '@checkup/core';

export default class ConfigGenerator extends BaseGenerator {
  works: Works = Works.OutsideProject;

  async initializing() {
    if (!this.canRunGenerator) {
      throw new CheckupError(
        'Checkup config file exists in this directory',
        `Checkup config file found at ${chalk.bold.white(
          this.destinationRoot()
        )}. You can only generate a ${chalk.bold.white(
          '.checkuprc'
        )} in a directory that doesn't contain one already.`
      );
    }
  }

  async prompting() {
    this.headline('checkup config');
  }

  async writing() {
    writeConfig(this.destinationRoot());

    this.log(`   ${chalk.green('create')} ${this.destinationPath('.checkuprc')}`);
  }
}
