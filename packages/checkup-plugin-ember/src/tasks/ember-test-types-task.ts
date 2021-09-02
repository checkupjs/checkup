import { join } from 'path';
import {
  Task,
  ESLintReport,
  LintAnalyzer,
  BaseTask,
  TaskContext,
  ESLintAnalyzer,
  ESLintOptions,
} from '@checkup/core';
import { Result } from 'sarif';

export const EMBER_TEST_TYPES: ESLintOptions = {
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
    'test-types': 'error',
  },
  rulePaths: [join(__dirname, '../eslint/rules')],
  useEslintrc: false,
};

export default class EmberTestTypesTask extends BaseTask implements Task {
  taskName = 'ember-test-types';
  taskDisplayName = 'Test Types';
  description = 'Gets a breakdown of all test types in an Ember.js project';
  category = 'testing';
  group = 'ember';

  private eslintAnalyzer: LintAnalyzer<ESLintReport>;
  private testFiles: string[];

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.eslintAnalyzer = new ESLintAnalyzer(EMBER_TEST_TYPES);

    this.testFiles = this.context.paths.filterByGlob('**/*test.js');
  }

  async run(): Promise<Result[]> {
    let esLintReport = await this.runEsLint();

    return this.buildResult(esLintReport);
  }

  private async runEsLint(): Promise<ESLintReport> {
    return this.eslintAnalyzer.analyze(this.testFiles);
  }

  buildResult(report: ESLintReport): Result[] {
    let results = this.flattenLintResults(report.results);

    results.forEach((result) => {
      let [testType, method] = result.message.split('|');

      this.addResult(`${testType} test found using ${method}`, 'informational', 'note', {
        location: {
          uri: result.filePath,
          startColumn: result.column,
          startLine: result.line,
        },
        properties: {
          testType,
          testMethod: method,
        },
        rule: {
          properties: {
            component: 'list',
          },
        },
      });
    });

    return this.results;
  }
}
