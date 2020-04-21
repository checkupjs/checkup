import * as Generator from 'yeoman-generator';
import * as chalk from 'chalk';
import * as path from 'path';

import { getVersion } from '../helpers/get-version';

const PLUGIN_DIR_PATTERN = /checkup-plugin-.*/;

export default class PluginGenerator extends Generator {
  answers!: {
    typescript: boolean;
    description: string;
    author: string;
    repository: string;
  };

  private get _ext() {
    return this.options.typescript ? 'ts' : 'js';
  }

  private get _destinationPath() {
    let cwd = process.cwd();

    if (PLUGIN_DIR_PATTERN.test(cwd)) {
      return cwd;
    }

    return path.join(cwd, this.options.name);
  }

  async prompting() {
    this.log(
      `Adding ${chalk.bold.white(this.options.name)} plugin. Version: ${chalk.bold.white(
        getVersion()
      )}`
    );

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

    this._normalizeName();

    this.options.typescript = this.answers.typescript;
    this.options.description = this.answers.description;
    this.options.author = this.answers.author;
    this.options.repository = this.answers.repository;
  }

  writing() {
    this.sourceRoot(path.join(__dirname, '../../templates/src/plugin'));
    this.destinationRoot(this._destinationPath);

    this.fs.copyTpl(
      this.templatePath(`src/index.${this._ext}.ejs`),
      this.destinationPath(`src/index.${this._ext}`),
      this.options
    );

    this.fs.copyTpl(
      this.templatePath(`src/hooks/register-tasks.${this._ext}.ejs`),
      this.destinationPath(`src/hooks/register-tasks.${this._ext}`),
      this.options
    );

    this.fs.copyTpl(
      this.templatePath(`src/types/index.${this._ext}.ejs`),
      this.destinationPath(`src/types/index.${this._ext}`),
      this.options
    );

    this.fs.copy(
      this.templatePath('__tests__/.gitkeep'),
      this.destinationPath('__tests__/.gitkeep')
    );
    this.fs.copy(
      this.templatePath('src/results/.gitkeep'),
      this.destinationPath('src/results/.gitkeep')
    );
    this.fs.copy(
      this.templatePath('src/tasks/.gitkeep'),
      this.destinationPath('src/tasks/.gitkeep')
    );
    this.fs.copy(this.templatePath('jest.config.js.ejs'), this.destinationPath('jest.config.js'));
    this.fs.copy(this.templatePath('tsconfig.json.ejs'), this.destinationPath('tsconfig.json'));

    this.fs.copyTpl(
      this.templatePath('package.json.ejs'),
      this.destinationPath('package.json'),
      this.options
    );

    this.fs.copyTpl(
      this.templatePath('README.md.ejs'),
      this.destinationPath('README.md'),
      this.options
    );
  }

  _normalizeName(): void {
    let name = this.options.name;

    if (!PLUGIN_DIR_PATTERN.test(name)) {
      this.options.name = `checkup-plugin-${name}`;
    }
  }
}
