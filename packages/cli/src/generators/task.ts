import * as Generator from 'yeoman-generator';
import * as _ from 'lodash';
import * as chalk from 'chalk';
import * as path from 'path';

import { Category, Priority } from '@checkup/core';

import { Options } from '../commands/generate';
import { PackageJson } from 'type-fest';

interface TaskOptions extends Options {
  typescript: boolean;
  category: string;
  priority: string;
}

const { version } = require('../../package.json');

export default class TaskGenerator extends Generator {
  packageJson!: PackageJson;

  answers!: {
    typescript: boolean;
    category: string;
    priority: string;
  };

  private get _ts() {
    let devDeps = this.packageJson.devDependencies;
    return (devDeps !== undefined && devDeps.typescript) || this.options.typescript;
  }

  private get _ext() {
    return this._ts ? 'ts' : 'js';
  }

  constructor(args: any, public options: TaskOptions) {
    super(args, options);
  }

  async prompting() {
    this.packageJson = this.fs.readJSON('package.json');

    if (
      !this.packageJson ||
      !(this.packageJson.keywords && this.packageJson.keywords.includes('oclif-plugin'))
    ) {
      throw new Error('not in a plugin directory');
    }

    this.log(
      `Adding a ${chalk.bold.white(this.options.name)} task to ${chalk.bold.white(
        this.packageJson.name
      )} Version: ${chalk.bold.white(version)}`
    );

    const defaults = {
      typescript: true,
      category: Category.Core,
      priority: Priority.Low,
    };

    if (this.options.defaults) {
      this.answers = defaults;
    } else {
      this.answers = await this.prompt([
        {
          type: 'confirm',
          name: 'typescript',
          message: 'TypeScript',
          default: () => true,
        },
        {
          type: 'list',
          name: 'category',
          message: 'Select a task category',
          choices: [
            { name: 'core', value: 'Core' },
            { name: 'migration', value: 'Migration' },
            { name: 'insights', value: 'Insights' },
          ],
          default: 'Core',
        },
        {
          type: 'list',
          name: 'priority',
          message: 'Select a task priority',
          choices: [
            { name: 'high', value: 'High' },
            { name: 'medium', value: 'Medium' },
            { name: 'low', value: 'Low' },
          ],
          default: 'Low',
        },
      ]);
    }

    this.options.typescript = this.answers.typescript;
    this.options.category = this.answers.category;
    this.options.priority = this.answers.priority;
  }

  writing() {
    this.sourceRoot(path.join(__dirname, '../../templates'));

    const options = { ...this.options, _ };

    this.fs.copyTpl(
      this.templatePath(`src/task/task.${this._ext}.ejs`),
      this.destinationPath(`src/tasks/${this.options.name}-task.${this._ext}`),
      options
    );

    this.fs.copyTpl(
      this.templatePath(`src/task/task-result.${this._ext}.ejs`),
      this.destinationPath(`src/results/${this.options.name}-task-result.${this._ext}`),
      options
    );

    this.fs.copyTpl(
      this.templatePath(`src/__tests__/task.${this._ext}.ejs`),
      this.destinationPath(`__tests__/${this.options.name}-task-test.${this._ext}`),
      options
    );
  }
}
