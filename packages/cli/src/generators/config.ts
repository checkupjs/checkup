import * as Generator from 'yeoman-generator';

import {
  CheckupConfigFormat,
  CheckupConfigService,
  CosmiconfigService,
  getInitializationConfigLoader,
} from '@checkup/core';

import { Answers } from 'inquirer';

export default class ConfigGenerator extends Generator {
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
    this.configService.write();
  }
}
