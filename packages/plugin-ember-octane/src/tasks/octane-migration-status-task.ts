import * as globby from 'globby';

import { BaseTask, Category, Priority, Task } from '@checkup/core';
import { OCTANE_ES_LINT_CONFIG, OCTANE_TEMPLATE_LINT_CONFIG } from '../utils/lint-configs';
import {
  TemplateLintMessage,
  TemplateLintReport,
  TemplateLintResult,
} from '../types/ember-template-lint';

import { CLIEngine } from 'eslint';
import { OctaneMigrationStatusTaskResult } from '../results';
import { getESLintEngine } from '../linters/es-lint';
import { getTemplateLinter } from '../linters/ember-template-lint';

const fs = require('fs');
const TemplateLinter = require('ember-template-lint');
const debug = require('debug')('checkup:plugin-ember-octane');

export default class OctaneMigrationStatusTask extends BaseTask implements Task {
  meta = {
    taskName: 'octane-migration-status',
    friendlyTaskName: 'Ember Octane Migration Status',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.Medium,
    },
  };

  private esLintEngine: CLIEngine;
  private templateLinter: typeof TemplateLinter;

  constructor(cliArguments: any) {
    super(cliArguments);

    this.esLintEngine = getESLintEngine(OCTANE_ES_LINT_CONFIG);
    this.templateLinter = getTemplateLinter(OCTANE_TEMPLATE_LINT_CONFIG);
  }

  get rootPath(): string {
    return this.args.path;
  }

  async run(): Promise<OctaneMigrationStatusTaskResult> {
    let esLintReport = this.runEsLint();
    let templateLintReport = await this.runTemplateLint();

    debug('ESLint Report', esLintReport);
    debug('Ember Template Lint Report', templateLintReport);

    let result = new OctaneMigrationStatusTaskResult(this.meta, esLintReport, templateLintReport);

    return result;
  }

  private runEsLint(): CLIEngine.LintReport {
    return this.esLintEngine.executeOnFiles([`${this.rootPath}/+(app|addon)/**/*.js`]);
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let filePaths = await globby(`${this.rootPath}/+(app|addon)/**/*.hbs`);

    let sources = filePaths.map((path) => ({
      path,
      template: fs.readFileSync(path, { encoding: 'utf8' }),
    }));

    let results: TemplateLintResult[] = sources.map(({ path, template }) => {
      let messages: TemplateLintMessage[] = this.templateLinter.verify({
        source: template,
        moduleId: path,
      });

      return {
        messages,
        errorCount: messages.length,
        filePath: path,
        source: template,
      };
    });

    let errorCount = results
      .map(({ errorCount }) => errorCount)
      .reduce((totalErrorCount, currentErrorCount) => totalErrorCount + currentErrorCount, 0);

    return {
      errorCount,
      results,
    };
  }
}
