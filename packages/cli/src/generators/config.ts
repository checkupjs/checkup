import * as chalk from 'chalk';

import {
  CheckupConfigFormat,
  CheckupConfigService,
  CosmiconfigService,
  getInitializationConfigLoader,
} from '@checkup/core';

import { Answers } from 'inquirer';
import BaseGenerator from './base-generator';

export default class ConfigGenerator extends BaseGenerator {
  private answers!: Answers;
  private configService!: CheckupConfigService;

  async initializing() {
    const configResult = await new CosmiconfigService().search(this.destinationRoot());

    if (configResult !== null) {
      throw new Error(
        `Cannot initialize checkup config file. checkup config file already found at ${configResult.filepath}`
      );
    }
  }

  async prompting() {
    this.headline('checkup config');

    this.answers = await this.prompt([
      {
        name: 'format',
        message: 'What format do you want your config file to be in?',
        type: 'list',
        choices: Object.keys(CheckupConfigFormat),
      },
    ]);

    const format = this.answers.format as CheckupConfigFormat;

    this.configService = await CheckupConfigService.load(
      getInitializationConfigLoader(this.destinationRoot(), format)
    );
  }

  async writing() {
    let configPath = this.configService.write();
    this.log(`   ${chalk.green('create')} ${configPath}`);
  }
}
