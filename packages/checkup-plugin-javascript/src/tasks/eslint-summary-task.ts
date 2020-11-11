import {
  BaseTask,
  ESLintOptions,
  ESLintReport,
  Parser,
  Task,
  TaskContext,
  buildResultFromLintResult,
  buildLintResultData,
  bySeverity,
  groupDataByField,
} from '@checkup/core';
import { join, resolve } from 'path';

import { PackageJson } from 'type-fest';
import { readFileSync } from 'fs';
import { Result } from 'sarif';

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

export class EslintSummaryTask extends BaseTask implements Task {
  taskName = 'eslint-summary';
  taskDisplayName = 'Eslint Summary';
  category = 'linting';

  private _eslintParser: Parser<ESLintReport>;

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let createEslintParser = this.context.parsers.get('eslint')!;

    let eslintConfig: ESLintOptions = readEslintConfig(
      this.context.paths,
      this.context.cliFlags.cwd,
      this.context.pkg
    );
    this._eslintParser = createEslintParser(eslintConfig);
  }

  async run(): Promise<Result[]> {
    let report = await this._eslintParser.execute(this.context.paths.filterByGlob('**/*.js'));
    let transformedData = buildLintResultData(report, this.context.cliFlags.cwd);

    let lintingErrors = groupDataByField(bySeverity(transformedData, 2), 'lintRuleId');
    let lintingWarnings = groupDataByField(bySeverity(transformedData, 1), 'lintRuleId');

    let errorsResult = lintingErrors.map((lintingError) => {
      return this.toJson(
        buildResultFromLintResult(lintingError, {
          type: 'error',
        })
      );
    });
    let warningsResult = lintingWarnings.map((lintingWarning) => {
      return this.toJson(
        buildResultFromLintResult(lintingWarning, {
          type: 'warning',
        })
      );
    });

    return [...errorsResult, ...warningsResult];
  }
}

export function readEslintConfig(
  paths: string[],
  basePath: string,
  pkg: PackageJson
): ESLintOptions {
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
    throw new Error(
      'No eslint config found in root (in the form of .eslintrc.* or as an eslintConfig field in package.json)'
    );
  }
}
