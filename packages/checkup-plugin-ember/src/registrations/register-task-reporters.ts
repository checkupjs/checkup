import { RegisterTaskReporterArgs } from '@checkup/core';
import { report as reportEmberTestTypes } from '../reporters/ember-test-types-reporter';
import { report as reportEmberOctaneMigrationStatus } from '../reporters/ember-octane-migration-status-reporter';
import { report as reportEmberTemplateLintSummary } from '../reporters/ember-template-lint-summary-reporter';

const register = async function ({ registerTaskReporter }: RegisterTaskReporterArgs) {
  registerTaskReporter('ember-test-types', reportEmberTestTypes);
  registerTaskReporter('ember-octane-migration-status', reportEmberOctaneMigrationStatus);
  registerTaskReporter('ember-template-lint-summary', reportEmberTemplateLintSummary);
};

export default register;
