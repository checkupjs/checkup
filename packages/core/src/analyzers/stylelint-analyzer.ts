import { lint, LinterOptions, LinterResult } from 'stylelint';
import { mergeLintConfig } from '../utils/merge-lint-config.js';
import { TaskConfig } from '../types/config.js';

/**
 * A class for analyzing .css files using stylelint.
 *
 * @export
 * @class StyleLintAnalyzer
 */
export default class StyleLintAnalyzer {
  config: Partial<LinterOptions>;

  constructor(config: Partial<LinterOptions>, taskConfig?: TaskConfig) {
    if (taskConfig && taskConfig.stylelintConfig) {
      config = mergeLintConfig(config, taskConfig.stylelintConfig) as LinterOptions;
    }

    this.config = config;
  }

  async analyze(paths: string[]): Promise<LinterResult> {
    this.config.files = paths;

    return lint(this.config);
  }
}
