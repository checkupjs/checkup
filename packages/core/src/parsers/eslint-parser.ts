import { CreateParser, Parser } from '../types';

import { CLIEngine } from 'eslint';

class ESLintParser implements Parser<CLIEngine.LintReport> {
  engine: CLIEngine;

  constructor(config: CLIEngine.Options) {
    this.engine = new CLIEngine(config);
  }

  execute(paths: string[]): CLIEngine.LintReport {
    return this.engine.executeOnFiles(paths);
  }
}

let createParser: CreateParser<CLIEngine.Options, Parser<CLIEngine.LintReport>> = function (
  config: CLIEngine.Options
) {
  return new ESLintParser(config);
};

export { createParser };
