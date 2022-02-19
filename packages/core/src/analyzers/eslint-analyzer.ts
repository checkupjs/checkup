import { ESLint, Linter, Rule } from 'eslint';
import { mergeLintConfig } from '../utils/merge-lint-config';
import { TaskConfig } from '../types/config';

/**
 * A class for analyzing JavaScript/TypeScript files using eslint.
 *
 * @export
 * @class ESLintAnalyzer
 */
export default class ESLintAnalyzer {
  engine: ESLint;
  rules: Map<string, Rule.RuleModule>;

  constructor(options: ESLint.Options, taskConfig?: TaskConfig) {
    if (taskConfig && taskConfig.eslintConfig) {
      options.baseConfig = mergeLintConfig(options.baseConfig, taskConfig.eslintConfig);
    }

    this.engine = new ESLint(options);
    this.rules = new Linter().getRules();
  }

  async analyze(paths: string[]): Promise<ESLint.LintResult[]> {
    return this.engine.lintFiles(paths);
  }
}
