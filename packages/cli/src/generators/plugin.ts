import * as chalk from 'chalk';

import { Answers } from 'inquirer';
import BaseGenerator, { Works } from './base-generator';
import { join } from 'path';
import { readJsonSync } from 'fs-extra';
import { readdirSync, existsSync } from 'fs';
import { CheckupError } from '@checkup/core';

const PLUGIN_DIR_PATTERN = /checkup-plugin-.*/;

export default class PluginGenerator extends BaseGenerator {
  works: Works = Works.OutsidePlugin;
  answers!: Answers;

  private get _destinationPath() {
    let cwd = process.cwd();

    if (PLUGIN_DIR_PATTERN.test(cwd)) {
      return cwd;
    }

    return join(cwd, this.options.name);
  }

  initializing() {
    if (!this.canRunGenerator) {
      throw new CheckupError(
        `Can only generate plugins outside a Checkup plugin directory`,
        `Run ${chalk.bold.white('checkup generate plugin')} from outside a Checkup plugin`
      );
    }
  }

  async prompting() {
    this._normalizeName();

    if (existsSync(this._destinationPath) && readdirSync(this._destinationPath).length > 0) {
      throw new CheckupError(
        `Plugin destination ${chalk.bold.white(this._destinationPath)} is not empty`,
        'Run the plugin generator in an empty directory'
      );
    }

    this.headline(this.options.name);

    const defaults = {
      typescript: true,
      description: 'Checkup plugin',
      author: '',
      repository: '',
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
          type: 'input',
          name: 'description',
          message: 'Description',
          default: 'Checkup plugin',
        },
        {
          type: 'input',
          name: 'author',
          message: 'Author',
          default: '',
        },
        {
          type: 'input',
          name: 'repository',
          message: 'Repository',
          default: '',
        },
      ]);
    }

    const checkupVersion = readJsonSync(join(__dirname, '../../package.json')).version;
    this.options.checkupVersion = checkupVersion;
    this.options.typescript = this.answers.typescript;
    this.options.description = this.answers.description;
    this.options.author = this.answers.author;
    this.options.repository = this.answers.repository;
  }

  writing() {
    this.sourceRoot(join(__dirname, '../../templates/src/plugin'));
    this.destinationRoot(this._destinationPath);

    this.fs.copyTpl(
      this.templatePath(`src/index.${this._ext}.ejs`),
      this.destinationPath(`${this._dir}/index.${this._ext}`),
      this.options
    );

    this.fs.copyTpl(
      this.templatePath(`src/types/index.${this._ext}.ejs`),
      this.destinationPath(`${this._dir}/types/index.${this._ext}`),
      this.options
    );

    this.fs.copy(
      this.templatePath('__tests__/.gitkeep'),
      this.destinationPath('__tests__/.gitkeep')
    );

    this.fs.copy(
      this.templatePath('src/registrations/.gitkeep'),
      this.destinationPath(`${this._dir}/registrations/.gitkeep`)
    );

    this.fs.copy(
      this.templatePath('src/results/.gitkeep'),
      this.destinationPath(`${this._dir}/results/.gitkeep`)
    );

    this.fs.copy(
      this.templatePath('src/tasks/.gitkeep'),
      this.destinationPath(`${this._dir}/tasks/.gitkeep`)
    );

    this.fs.copyTpl(
      this.templatePath(`jest.config.${this._ext}.ejs`),
      this.destinationPath('jest.config.js'),
      this.options
    );

    if (this.options.typescript) {
      this.fs.copy(this.templatePath('tsconfig.json.ejs'), this.destinationPath('tsconfig.json'));
    }

    this.fs.copy(this.templatePath('.eslintignore.ejs'), this.destinationPath('.eslintignore'));
    this.fs.copy(
      this.templatePath(`.eslintrc.${this._ext}.ejs`),
      this.destinationPath('.eslintrc')
    );
    this.fs.copy(this.templatePath('.gitignore.ejs'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('.prettierrc.js.ejs'), this.destinationPath('.prettierrc.js'));

    this.fs.copyTpl(
      this.templatePath(`package.json.${this._ext}.ejs`),
      this.destinationPath('package.json'),
      this.options
    );

    this.fs.copyTpl(
      this.templatePath('README.md.ejs'),
      this.destinationPath('README.md'),
      this.options
    );

    this.yarnInstall();
  }

  _normalizeName(): void {
    let name = this.options.name;

    if (!PLUGIN_DIR_PATTERN.test(name)) {
      this.options.name = `checkup-plugin-${name}`;
    }
  }
}
