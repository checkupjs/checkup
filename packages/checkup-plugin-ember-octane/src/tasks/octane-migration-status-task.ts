import * as globby from 'globby';

import {
  BaseTask,
  Category,
  ESLintReport,
  Parser,
  Priority,
  Task,
  TaskContext,
  TemplateLintReport,
  TemplateLinter,
} from '@checkup/core';
import { OCTANE_ES_LINT_CONFIG, OCTANE_TEMPLATE_LINT_CONFIG } from '../utils/lint-configs';

import OctaneMigrationStatusTaskResult from '../results/octane-migration-status-task-result';

export default class OctaneMigrationStatusTask extends BaseTask implements Task {
  meta = {
    taskName: 'octane-migration-status',
    friendlyTaskName: 'Ember Octane Migration Status',
    taskClassification: {
      category: Category.Migrations,
      priority: Priority.High,
    },
  };

  private eslintParser: Parser<ESLintReport>;
  private templateLinter: TemplateLinter;

  constructor(context: TaskContext) {
    super(context);

    let createEslintParser = this.context.parsers.get('eslint')!;

    let createEmberTemplateLintParser = this.context.parsers.get('ember-template-lint')!;

    this.eslintParser = createEslintParser(OCTANE_ES_LINT_CONFIG);
    this.templateLinter = createEmberTemplateLintParser(OCTANE_TEMPLATE_LINT_CONFIG);
  }

  get rootPath(): string {
    return this.context.cliArguments.path;
  }

  async run(): Promise<OctaneMigrationStatusTaskResult> {
    let [esLintReport, templateLintReport] = await Promise.all([
      this.runEsLint(),
      this.runTemplateLint(),
    ]);

    this.debug('ESLint Report', esLintReport);
    this.debug('Ember Template Lint Report', templateLintReport);

    let result = new OctaneMigrationStatusTaskResult(this.meta, esLintReport, templateLintReport);

    return result;
  }

  private async runEsLint(): Promise<ESLintReport> {
    return this.eslintParser.execute([`${this.rootPath}/+(app|addon)/**/*.js`]);
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let paths = await globby(`${this.rootPath}/+(app|addon)/**/*.hbs`);

    return this.templateLinter.execute(paths);
  }
}
