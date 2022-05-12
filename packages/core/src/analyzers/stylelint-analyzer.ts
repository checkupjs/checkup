import styleLint from 'stylelint';
import { mergeLintConfig } from '../utils/merge-lint-config.js';
import { TaskConfig } from '../types/config.js';

const { lint } = styleLint;

/**
 * A class for analyzing .css files using stylelint.
 *
 * @export
 * @class StyleLintAnalyzer
 */
export default class StyleLintAnalyzer {
  config: Partial<styleLint.LinterOptions>;

  constructor(config: Partial<styleLint.LinterOptions>, taskConfig?: TaskConfig) {
    if (taskConfig && taskConfig.stylelintConfig) {
      config = mergeLintConfig(config, taskConfig.stylelintConfig) as styleLint.LinterOptions;
    }

    this.config = config;
  }

  async analyze(paths: string[]): Promise<styleLint.LinterResult> {
    this.config.files = paths;

    return lint(this.config);
  }
}
