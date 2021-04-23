import * as fs from 'fs';

import { CreateParser, Parser } from '../types/parsers';
import {
  TemplateLintConfig,
  TemplateLintMessage,
  TemplateLintReport,
  TemplateLintResult,
} from '../types/ember-template-lint';
import { TaskConfig } from '../types/config';
import { mergeLintConfig } from '../utils/merge-lint-config';

const TemplateLinter = require('ember-template-lint');

class EmberTemplateLintParser implements Parser<TemplateLintReport> {
  engine: typeof TemplateLinter;

  constructor(config: TemplateLintConfig) {
    this.engine = new TemplateLinter({
      config,
    });
  }

  async execute(paths: string[]): Promise<TemplateLintReport> {
    let sources = paths.map((path) => ({
      path,
      template: fs.readFileSync(path, { encoding: 'utf8' }),
    }));

    let results: TemplateLintResult[] = [];

    for (let { path, template } of sources) {
      let messages: TemplateLintMessage[] = await this.engine.verify({
        source: template,
        filePath: path,
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
}

let createParser: CreateParser<TemplateLintConfig, Parser<TemplateLintReport>> = function (
  config: TemplateLintConfig,
  taskConfig?: TaskConfig
) {
  if (taskConfig && taskConfig.emberTemplateLintConfig) {
    config = mergeLintConfig(config, taskConfig.emberTemplateLintConfig);
  }

  return new EmberTemplateLintParser(config);
};

export { createParser, EmberTemplateLintParser };
