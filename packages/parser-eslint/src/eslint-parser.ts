import { JsonObject } from 'type-fest';
import { Parser } from '@checkup/core';

const CLIEngine = require('eslint').CLIEngine;

export default class ESLintParser implements Parser {
  engine: typeof CLIEngine;

  constructor() {
    this.engine = new CLIEngine({
      baseConfig: {
        // I assume this will be some sort of eslint-config-checkup
        extends: ['eslint:recommended'],
      },
      useEslintrc: false,
    });
  }

  execute(paths: string[]): JsonObject {
    const report = this.engine.executeOnFiles(paths);
    const formatter = this.engine.getFormatter('json');

    return formatter(report.results);
  }
}
