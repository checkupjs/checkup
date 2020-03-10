import { BaseTask, Category, Priority, Task } from '@checkup/core';
import { CLIEngine } from 'eslint';
import * as globby from 'globby';
// import fs from 'fs';
import { OctaneMigrationStatusTaskResult } from '../results';

const fs = require('fs');
const TemplateLinter = require('ember-template-lint');
const debug = require('debug')('checkup:plugin-ember-octane');

interface EmberTemplateLintReport {}

export default class OctaneMigrationStatusTask extends BaseTask implements Task {
  meta = {
    taskName: 'octane-migration-status',
    friendlyTaskName: 'Ember Octane Migration Status',
    taskClassification: {
      category: Category.Core,
      priority: Priority.Medium,
    },
  };

  private esLintEngine: CLIEngine;
  private templateLinter: typeof TemplateLinter;

  constructor(cliArguments: any) {
    super(cliArguments);

    // These options are taken from a default ember application build on top of ember-source 3.16.*
    this.esLintEngine = new CLIEngine({
      parser: 'babel-eslint',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          legacyDecorators: true,
        },
      },
      plugins: ['ember'],
      envs: ['browser'],
      rules: {
        'ember/classic-decorator-hooks': 'error',
        'ember/classic-decorator-no-classic-methods': 'error',
        'ember/no-actions-hash': 'error',
        'ember/no-classic-classes': 'error',
        'ember/no-classic-components': 'error',
        // 'ember/no-component-lifecycle-hooks': 'error',
        'ember/no-computed-properties-in-native-classes': 'error',
        'ember/no-get-with-default': 'error',
        'ember/no-get': 'error',
        'ember/no-jquery': 'error',
        'ember/require-tagless-components': 'error',
      },
      useEslintrc: false,
    });

    this.templateLinter = new TemplateLinter({
      rules: {
        'no-action': 'error',
        'no-curly-component-invocation': [
          'error',
          {
            noImplicitThis: 'error',
            requireDash: 'off',
          },
        ],
        'no-implicit-this': 'error',
      },
    });
  }

  get rootPath(): string {
    return this.args.path;
  }

  async run(): Promise<OctaneMigrationStatusTaskResult> {
    let esLintReport = this.runEsLint();
    // let templateLintReport = await this.runTemplateLint();
    let result = new OctaneMigrationStatusTaskResult(this.meta, esLintReport);

    return result;
  }

  private runEsLint(): CLIEngine.LintReport {
    return this.esLintEngine.executeOnFiles([`${this.rootPath}/+(app|addon)/**/*.js`]);
  }

  private async runTemplateLint() {
    let filePaths = await globby(`${this.rootPath}/+(app|addon)/**/*.hbs`);

    let sources = filePaths.map(path => ({
      path,
      template: fs.readFileSync(path, { encoding: 'utf8' }),
    }));

    let results = sources.map(({ path, template }) => {
      return this.templateLinter.verify({ source: template, moduleId: path });
    });

    debug('Ember Template Lint Report', results);

    return results;
  }
}
