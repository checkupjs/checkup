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

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let createEslintParser = this.context.parsers.get('eslint')!;

    let createEmberTemplateLintParser = this.context.parsers.get('ember-template-lint')!;

    this.eslintParser = createEslintParser(OCTANE_ES_LINT_CONFIG);
    this.templateLinter = createEmberTemplateLintParser(OCTANE_TEMPLATE_LINT_CONFIG);
  }

  get rootPath(): string {
    return this.context.cliFlags.cwd;
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
    let jsPaths = this.context.paths.filterByGlob('**/*.js');

    return this.eslintParser.execute(jsPaths);
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');

    return this.templateLinter.execute(hbsPaths);
  }
}
