import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import {
  BaseTask,
  ESLintOptions,
  ESLintReport,
  LintAnalyzer,
  Task,
  bySeverity,
  groupDataByField,
  sarifBuilder,
  lintBuilder,
  TaskContext,
  TaskError,
  ESLintAnalyzer,
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

  private analyzer: LintAnalyzer<ESLintReport>;

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let eslintConfig: ESLintOptions = this.readEslintConfig(
      this.context.paths,
      this.context.options.cwd,
      this.context.pkg as PackageJsonWithEslint
    );
    this.analyzer = new ESLintAnalyzer(eslintConfig);
  }

  async run(): Promise<Result[]> {
    let report = await this.analyzer.analyze(this.context.paths.filterByGlob('**/*.js'));
    let transformedData = lintBuilder.toLintResults(report.results, this.context.options.cwd);

    let lintingErrors = groupDataByField(bySeverity(transformedData, 2), 'lintRuleId');
    let lintingWarnings = groupDataByField(bySeverity(transformedData, 1), 'lintRuleId');

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

  readEslintConfig(paths: string[], basePath: string, pkg: PackageJsonWithEslint): ESLintOptions {
    let eslintConfigFile: string = '';

    for (const acceptedConfigFile of ACCEPTED_ESLINT_CONFIG_FILES) {
      let resolvedAcceptedConfigFile = join(resolve(basePath), acceptedConfigFile);

      if (paths.includes(resolvedAcceptedConfigFile)) {
        eslintConfigFile = readFileSync(resolvedAcceptedConfigFile, { encoding: 'utf8' });
        break;
      }
    }

    if (eslintConfigFile) {
      return eslintConfigFile as ESLintOptions;
    } else if (pkg.eslintConfig !== null) {
      return pkg.eslintConfig as ESLintOptions;
    } else {
      throw new TaskError({
        taskName: this.taskName,
        taskErrorMessage:
          'No eslint config found in root (in the form of .eslintrc.* or as an eslintConfig field in package.json)',
      });
    }
  }
}
