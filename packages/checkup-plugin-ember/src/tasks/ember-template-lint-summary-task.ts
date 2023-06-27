import { join, resolve } from 'path';
import { createRequire } from 'module';
import {
  BaseTask,
  Task,
  TaskContext,
  TemplateLinter,
  TemplateLintReport,
  EmberTemplateLintAnalyzer,
} from '@checkup/core';
import { Result } from 'sarif';

const require = createRequire(import.meta.url);

export default class TemplateLintSummaryTask extends BaseTask implements Task {
  taskName = 'ember-template-lint-summary';
  taskDisplayName = 'Template Lint Summary';
  description = 'Gets a summary of all ember-template-lint results in an Ember.js project';
  category = 'linting';
  group = 'ember';

  private emberTemplateLintAnalyzer: TemplateLinter;

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.addRule({
      properties: {
        component: {
          name: 'list',
          options: {
            items: {
              Errors: {
                groupBy: 'level',
                value: 'error',
              },
              Warnings: {
                groupBy: 'level',
                value: 'warning',
              },
            },
          },
        },
      },
    });

    let templateLintConfigFilePath = join(resolve(this.context.options.cwd), '.template-lintrc.js');

    this.emberTemplateLintAnalyzer = new EmberTemplateLintAnalyzer(
      require(templateLintConfigFilePath)
    );
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let templateLintablePaths = this.context.paths.filterByGlob([
      '**/*.hbs',
      '**/*.js',
      '**/*.gjs',
      '**/!(*.d).ts',
      '**/*.gts',
    ]);

    return this.emberTemplateLintAnalyzer.analyze(templateLintablePaths);
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
          endLine: result.endLine,
          endColumn: result.endColumn,
        },
        properties: {
          ruleId: result.lintRuleId,
        },
      });
    });

    return this.results;
  }
}
