import { RegisterTaskReporterArgs } from '@checkup/core';
import { report as reportEslintSummary } from '../reporters/eslint-summary-reporter';
import { report as reportOutdatedDependencies } from '../reporters/outdated-dependencies-reporter';

const register = async function ({ registerTaskReporter }: RegisterTaskReporterArgs) {
  registerTaskReporter('eslint-summary', reportEslintSummary);
  registerTaskReporter('outdated-dependencies', reportOutdatedDependencies);
};

export default register;
