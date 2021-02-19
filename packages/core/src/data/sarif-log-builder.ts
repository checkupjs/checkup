import { Log, Run, ReportingDescriptor, Result } from 'sarif';
import { builder } from './sarif';

const RUN_DEFAULTS = {
  tool: {
    driver: {
      name: 'checkup',
      language: 'en-US',
      informationUri: 'https://github.com/checkupjs/checkup',
    },
  },
};

export class SarifLogBuilder {
  log: Log;
  runs: Run[];
  rules: ReportingDescriptor[];
  results: Result[];

  constructor() {
    this.runs = [];
    this.rules = [];
    this.results = [];
    this.log = {
      version: '2.1.0',
      $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json',
      runs: this.runs,
    };

    this.addRun();
  }

  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  addRun(run: Run = { tool: { driver: { name: 'checkup' } } }) {
    this.runs.push({
      ...RUN_DEFAULTS,
      ...{
        tool: {
          driver: {
            rules: this.rules,
          },
        },
        results: this.results,
      },
      ...run,
    });
  }

  addRule(rule: ReportingDescriptor) {
    if (!this.rules.find((r) => r.id === rule.id)) {
      this.rules.push(rule);
    }
  }

  addResult(result: Result) {
    this.results.push(builder.buildResult(result));
  }
}
