import { CreateParser, Parser } from '../types/parsers';

import { CLIEngine } from 'eslint';

class ESLintParser implements Parser<CLIEngine.LintReport> {
  engine: CLIEngine;

  constructor(config: CLIEngine.Options) {
    this.engine = new CLIEngine(config);
  }

  async execute(paths: string[]): Promise<CLIEngine.LintReport> {
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

let createParser: CreateParser<CLIEngine.Options, Parser<CLIEngine.LintReport>> = function (
  config: CLIEngine.Options
) {
  return new ESLintParser(config);
};

export { createParser };
