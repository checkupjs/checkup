import { join, resolve } from 'path';
import {
  BaseTask,
  Task,
  TaskContext,
  TemplateLinter,
  TemplateLintReport,
  EmberTemplateLintAnalyzer,
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

    this.emberTemplateLintAnalyzer = new EmberTemplateLintAnalyzer(
      require(resolvedTemplateLintConfigFile)
    );
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');

    return this.emberTemplateLintAnalyzer.analyze(hbsPaths);
  }

  async run(): Promise<Result[]> {
    let report = await this.runTemplateLint();
    let results = this.flattenLintResults(report.results);

    results.forEach((result) => {
      this.addResult(result.message, 'review', result.severity === 2 ? 'error' : 'warning', {
        location: {
          uri: result.filePath,
          startColumn: result.column,
          startLine: result.line,
        },
        properties: {
          component: 'table',
        },
      });
    });

    return this.results;
  }
}
