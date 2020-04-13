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
} from '@checkup/core';
import { OCTANE_ES_LINT_CONFIG, OCTANE_TEMPLATE_LINT_CONFIG } from '../utils/lint-configs';

import { CLIEngine } from 'eslint';
import { OctaneMigrationStatusTaskResult } from '../results';

const TemplateLinter = require('ember-template-lint');

export default class OctaneMigrationStatusTask extends BaseTask implements Task {
  meta = {
    taskName: 'octane-migration-status',
    friendlyTaskName: 'Ember Octane Migration Status',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.Medium,
    },
  };

  private eslintParser: Parser<CLIEngine.LintReport>;
  private templateLinter: typeof TemplateLinter;

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
    let esLintReport = this.runEsLint();
    let templateLintReport = await this.runTemplateLint();

    this.debug('ESLint Report', esLintReport);
    this.debug('Ember Template Lint Report', templateLintReport);

    let result = new OctaneMigrationStatusTaskResult(this.meta, esLintReport, templateLintReport);

    return result;
  }

  private runEsLint(): CLIEngine.LintReport {
    return this.eslintParser.execute([`${this.rootPath}/+(app|addon)/**/*.js`]);
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let paths = await globby(`${this.rootPath}/+(app|addon)/**/*.hbs`);

    return this.templateLinter.execute(paths);
  }
}
