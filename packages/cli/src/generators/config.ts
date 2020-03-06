import * as path from 'path';
import * as fs from 'fs';
import {
  CheckupConfig,
  CheckupConfigFormat,
  ConfigMapper,
  CosmiconfigService,
  CheckupConfigService,
  getInitializationConfigLoader,
} from '@checkup/core';
import { Answers } from 'inquirer';
import * as Generator from 'yeoman-generator';

export default class ConfigGenerator extends Generator {
  private static readonly questions = <const>[
    {
      name: 'framework',
      message: 'Which framework do you use?',
      type: 'list',
      choices: ['Ember', 'Other'],
    },
    {
      name: 'format',
      message: 'What format do you want your config file to be in?',
      type: 'list',
      choices: Object.keys(CheckupConfigFormat),
    },
  ];
  private static readonly answerChoicesToConfigMapper = {
    framework: {
      Ember: ConfigGenerator._addPlugin('@checkup/plugin-ember'),
      Other: (config: CheckupConfig) => config,
    },
  };
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
    this.answers = await this.prompt(ConfigGenerator.questions);
    const format = this.answers.format as CheckupConfigFormat;
    this.configService = await CheckupConfigService.load(
      getInitializationConfigLoader(this.destinationRoot(), format)
    ).then(configService => configService.map(...this._getConfigMappers()));
  }

  async writing() {
    await this.configService.write();
  }

  async install() {
    const { plugins } = await this.configService.get();

    if (fs.existsSync(path.join(this.destinationRoot(), 'yarn.lock'))) {
      this.yarnInstall(plugins, { dev: true });
    } else {
      this.npmInstall(plugins, { 'save-dev': true });
    }
  }

  private _getConfigMappers() {
    return (Object.entries(ConfigGenerator.answerChoicesToConfigMapper) as [
      typeof ConfigGenerator.questions[number]['name'],
      Record<string, ConfigMapper>
    ][]).map(([answerKey, choicesToMappers]) => choicesToMappers[this.answers[answerKey]]);
  }

  private static _addPlugin(pluginName: string): ConfigMapper {
    return config => {
      config.plugins.push(pluginName);
      return config;
    };
  }
}
