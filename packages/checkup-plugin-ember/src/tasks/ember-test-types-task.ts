import { join } from 'path';
import { dirname } from 'dirname-filename-esm';
import {
  Task,
  LintAnalyzer,
  BaseTask,
  TaskContext,
  ESLintAnalyzer,
  ESLintOptions,
  LintResult,
} from '@checkup/core';
import { Result } from 'sarif';

export const EMBER_TEST_TYPES: ESLintOptions = {
  baseConfig: {
    parser: 'babel-eslint',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        legacyDecorators: true,
      },
    },
    plugins: ['ember'],
    env: { browser: true },
    rules: {
      'test-types': 'error',
    },
  },
  rulePaths: [join(dirname(import.meta), '../eslint/rules')],
  useEslintrc: false,
};

export default class EmberTestTypesTask extends BaseTask implements Task {
  taskName = 'ember-test-types';
  taskDisplayName = 'Test Types';
  description = 'Gets a breakdown of all test types in an Ember.js project';
  category = 'testing';
  group = 'ember';

  private eslintAnalyzer: LintAnalyzer<LintResult[]>;
  private testFiles: string[];

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.addRule({
      properties: {
        component: {
          name: 'list',
          options: {
            items: {
              Application: {
                groupBy: 'properties.testType',
                value: 'application',
              },
              Rendering: {
                groupBy: 'properties.testType',
                value: 'rendering',
              },
              Unit: {
                groupBy: 'properties.testType',
                value: 'unit',
              },
            },
          },
        },
      },
    });

    this.eslintAnalyzer = new ESLintAnalyzer(EMBER_TEST_TYPES);

    this.testFiles = this.context.paths.filterByGlob('**/*test.js');
  }

  async run(): Promise<Result[]> {
    let esLintReport = await this.runEsLint();

    return this.buildResult(esLintReport);
  }

  private async runEsLint(): Promise<LintResult[]> {
    return this.eslintAnalyzer.analyze(this.testFiles);
  }

  buildResult(lintResults: LintResult[]): Result[] {
    let results = this.flattenLintResults(lintResults);

    results.forEach((result) => {
      let [testType, method] = result.message.split('|');

      this.addResult(`${testType} test found using ${method}`, 'informational', 'note', {
        location: {
          uri: result.filePath,
          startColumn: result.column,
          startLine: result.line,
          endLine: result.endLine,
          endColumn: result.endColumn,
        },
        properties: {
          testType,
          testMethod: method,
        },
      });
    });

    return this.results;
  }
}
