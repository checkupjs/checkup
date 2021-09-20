import { CLIEngine, Rule } from 'eslint';
import { mergeLintConfig } from '../utils/merge-lint-config';
import { TaskConfig } from '../types/config';

/**
 * A class for analyzing JavaScript/TypeScript files using eslint.
 *
 * @export
 * @class ESLintAnalyzer
 */
export default class ESLintAnalyzer {
  engine: CLIEngine;
  rules: Map<string, Rule.RuleModule>;

  constructor(config: CLIEngine.Options, taskConfig?: TaskConfig) {
    if (taskConfig && taskConfig.eslintConfig) {
      config = mergeLintConfig(config, taskConfig.eslintConfig);
    }

    this.engine = new CLIEngine(config);
    this.rules = this.engine.getRules();
  }

  async analyze(paths: string[]): Promise<CLIEngine.LintReport> {
    return new Promise((resolve, reject) => {
      try {
        let report = this.engine.executeOnFiles(paths);
        resolve(report);
      } catch (error) {
        reject(error);
      }
    });
  }
}
