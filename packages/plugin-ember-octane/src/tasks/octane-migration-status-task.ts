import { BaseTask, Category, Priority, Task, TaskClassification, TaskName } from '@checkup/core';
import { CLIEngine } from 'eslint';
import { OctaneMigrationStatusTaskResult } from '../results';

export default class OctaneMigrationStatusTask extends BaseTask implements Task {
  taskName: TaskName = 'octane-migration-status';
  friendlyTaskName: TaskName = 'Ember Octane Migration Status';
  taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.Medium,
  };

  public report!: CLIEngine.LintReport;
  private esLintEngine: CLIEngine;

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
  }

  get rootPath(): string {
    return this.args.path;
  }

  async run(): Promise<OctaneMigrationStatusTaskResult> {
    this.report = this.esLintEngine.executeOnFiles([`${this.rootPath}/+(app|addon)/**/*.js`]);
    let result = new OctaneMigrationStatusTaskResult(this.report);

    return result;
  }
}
