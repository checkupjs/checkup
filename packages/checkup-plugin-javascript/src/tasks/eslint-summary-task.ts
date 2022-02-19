import {
  BaseTask,
  LintAnalyzer,
  Task,
  TaskContext,
  ESLintAnalyzer,
  LintResult,
} from '@checkup/core';
import { PackageJson } from 'type-fest';
import { Result } from 'sarif';

export type PackageJsonWithEslint = PackageJson & { eslintConfig: string };

/**
 * @export
 * @description In prioritized order as specified by https://eslint.org/docs/user-guide/configuring
 */
export const ACCEPTED_ESLINT_CONFIG_FILES = [
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.yaml',
  '.eslintrc.yml',
  '.eslintrc.json',
  '.eslintrc',
];

export default class EslintSummaryTask extends BaseTask implements Task {
  taskName = 'eslint-summary';
  taskDisplayName = 'Eslint Summary';
  description = 'Gets a summary of all eslint results in a project';
  category = 'linting';

  private analyzer: LintAnalyzer<LintResult[]>;

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

    this.analyzer = new ESLintAnalyzer({
      cwd: this.context.options.cwd,
      useEslintrc: true,
    });
  }

  async run(): Promise<Result[]> {
    let lintResults = await this.analyzer.analyze(this.context.paths.filterByGlob('**/*.js'));
    let results = this.flattenLintResults(lintResults);

    results.forEach((result) => {
      this.addResult(result.message, 'review', result.severity === 2 ? 'error' : 'warning', {
        location: {
          uri: result.filePath,
          startColumn: result.column,
          startLine: result.line,
          endColumn: result.endColumn,
          endLine: result.endLine,
        },
        properties: {
          ruleId: result.lintRuleId,
        },
      });
    });

    return this.results;
  }
}
