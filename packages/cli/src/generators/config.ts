import * as chalk from 'chalk';

import BaseGenerator from './base-generator';
import { writeConfig } from '@checkup/core';

export default class ConfigGenerator extends BaseGenerator {
  async initializing() {
    const existingConfig = this.fs.exists(this.destinationPath('.checkuprc'));

    if (existingConfig) {
      throw new Error(
        `Cannot initialize checkup config file. checkup config file already found at ${this.destinationRoot()}`
      );
    }
  }

  async prompting() {
    this.headline('checkup config');
  }

  async writing() {
    let configPath = this.destinationPath('.checkuprc');

    writeConfig(configPath);

    this.log(`   ${chalk.green('create')} ${configPath}`);
  }
}
