import * as fs from 'fs';

import { extname } from 'path';

import TemplateLinter from 'ember-template-lint';
import {
  TemplateLintConfig,
  TemplateLintMessage,
  TemplateLintReport,
  TemplateLintResult,
} from '../types/ember-template-lint';
import { TaskConfig } from '../types/config.js';
import { mergeLintConfig } from '../utils/merge-lint-config.js';

/**
 * A class for analyzing .hbs files using ember-template-lint
 *
 * @export
 * @class EmberTemplateLintAnalyzer
 */
export default class EmberTemplateLintAnalyzer {
  engine: typeof TemplateLinter;

  constructor(config: TemplateLintConfig, taskConfig?: TaskConfig) {
    if (taskConfig && taskConfig.emberTemplateLintConfig) {
      config = mergeLintConfig(config, taskConfig.emberTemplateLintConfig);
    }

    this.engine = new TemplateLinter({
      config,
    });
  }

  async loadConfig() {
    await this.engine.loadConfig();
  }

  async analyze(paths: string[]): Promise<TemplateLintReport> {
    let sources = paths.map((path) => ({
      path,
      template: fs.readFileSync(path, { encoding: 'utf8' }),
    }));

    let results: TemplateLintResult[] = [];

    for (let { path, template } of sources) {
      let messages: TemplateLintMessage[] = await this.engine.verify({
        source: template,
        filePath: path,
        moduleId: this.removeExt(path), // this can be removed when https://github.com/ember-template-lint/ember-template-lint/issues/2128 is resolved
      });

      results.push({
        messages,
        errorCount: messages.length,
        filePath: path,
        source: template,
      });
    }

    let errorCount = results
      .map(({ errorCount }) => errorCount)
      .reduce((totalErrorCount, currentErrorCount) => totalErrorCount + currentErrorCount, 0);

    return {
      errorCount,
      results,
    };
  }

  // copied from ember-template-lint https://github.com/ember-template-lint/ember-template-lint/blob/master/bin/ember-template-lint.js
  removeExt(filePath: string) {
    return filePath.slice(0, -extname(filePath).length);
  }
}
