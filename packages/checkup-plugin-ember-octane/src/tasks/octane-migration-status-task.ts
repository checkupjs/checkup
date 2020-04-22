import * as globby from 'globby';

import {
  BaseTask,
  Category,
  CreateParser,
  Parser,
  ParserName,
  ParserOptions,
  ParserReport,
  Priority,
  Task,
  TemplateLintReport,
  TemplateLinter,
} from '@checkup/core';
import { OCTANE_ES_LINT_CONFIG, OCTANE_TEMPLATE_LINT_CONFIG } from '../utils/lint-configs';

import { CLIEngine } from 'eslint';
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

  private eslintParser: Parser<CLIEngine.LintReport>;
  private templateLinter: TemplateLinter;

  constructor(
    cliArguments: any,
    parsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>
  ) {
    super(cliArguments);

    let createEslintParser = parsers.get('eslint')!;

    let createEmberTemplateLintParser = parsers.get('ember-template-lint')!;

    this.eslintParser = createEslintParser(OCTANE_ES_LINT_CONFIG);
    this.templateLinter = createEmberTemplateLintParser(OCTANE_TEMPLATE_LINT_CONFIG);
  }

  get rootPath(): string {
    return this.args.path;
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

  private async runEsLint(): Promise<CLIEngine.LintReport> {
    return this.eslintParser.execute([`${this.rootPath}/+(app|addon)/**/*.js`]);
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let paths = await globby(`${this.rootPath}/+(app|addon)/**/*.hbs`);

    return this.templateLinter.execute(paths);
  }
}
