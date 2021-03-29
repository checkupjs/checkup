import {
  BaseTask,
  LintResult,
  Task,
  TaskContext,
  TemplateLinter,
  TemplateLintMessage,
  TemplateLintReport,
  groupDataByField,
  bySeverity,
  sarifBuilder,
  lintBuilder,
} from '@checkup/core';
import { join, resolve } from 'path';
import { Result } from 'sarif';

export default class TemplateLintSummaryTask extends BaseTask implements Task {
  taskName = 'ember-template-lint-summary';
  taskDisplayName = 'Template Lint Summary';
  category = 'linting';
  group = 'ember';

  private templateLinter: TemplateLinter;

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let createEmberTemplateLintParser = this.context.parsers.get('ember-template-lint')!;

    let resolvedTemplateLintConfigFile = join(
      resolve(this.context.options.cwd),
      '.template-lintrc.js'
    );

    this.templateLinter = createEmberTemplateLintParser(require(resolvedTemplateLintConfigFile));
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');

    return this.templateLinter.execute(hbsPaths);
  }

  async run(): Promise<Result[]> {
    let templateLintReport = await this.runTemplateLint();
    let lintResults = templateLintReport.results.reduce((resultDataItems, lintingResults) => {
      let messages = (<any>lintingResults.messages).map((lintMessage: TemplateLintMessage) => {
        return lintBuilder.toLintResult(
          lintMessage,
          this.context.options.cwd,
          lintingResults.filePath
        );
      });
      resultDataItems.push(...messages);

      return resultDataItems;
    }, [] as LintResult[]);

    let lintingErrors = groupDataByField(bySeverity(lintResults, 2), 'lintRuleId');
    let lintingWarnings = groupDataByField(bySeverity(lintResults, 1), 'lintRuleId');

    let errorsResult = lintingErrors.flatMap((lintingError) => {
      return sarifBuilder.fromLintResults(this, lintingError, {
        type: 'error',
      });
    });

    let warningsResult = lintingWarnings.flatMap((lintingWarning) => {
      return sarifBuilder.fromLintResults(this, lintingWarning, {
        type: 'warning',
      });
    });

    return [...errorsResult, ...warningsResult];
  }
}
