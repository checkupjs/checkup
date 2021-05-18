import { join, resolve } from 'path';
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
  ESLintAnalyzer,
} from '@checkup/core';
import { Result } from 'sarif';

export default class TemplateLintSummaryTask extends BaseTask implements Task {
  taskName = 'ember-template-lint-summary';
  taskDisplayName = 'Template Lint Summary';
  description = 'Gets a summary of all ember-template-lint results in an Ember.js project';
  category = 'linting';
  group = 'ember';

  private emberTemplateLintAnalyzer: TemplateLinter;

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let resolvedTemplateLintConfigFile = join(
      resolve(this.context.options.cwd),
      '.template-lintrc.js'
    );

    this.emberTemplateLintAnalyzer = new ESLintAnalyzer(require(resolvedTemplateLintConfigFile));
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');

    return this.emberTemplateLintAnalyzer.analyze(hbsPaths);
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
