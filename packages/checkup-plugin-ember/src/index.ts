import { RegistrationArgs, getPluginName } from '@checkup/core';

import { evaluateActions as evaluateTemplateLintDisables } from './actions/ember-template-lint-disable-actions';
import { evaluateActions as evaluateTemplateLintSummary } from './actions/ember-template-lint-summary-actions';
import { evaluateActions as evaluateTestTypes } from './actions/ember-test-types-actions';
import { report as reportEmberTestTypes } from './reporters/ember-test-types-reporter';
import { report as reportEmberOctaneMigrationStatus } from './reporters/ember-octane-migration-status-reporter';
import { report as reportEmberTemplateLintSummary } from './reporters/ember-template-lint-summary-reporter';
import EmberDependenciesTask from './tasks/ember-dependencies-task';
import EmberInRepoAddonsEnginesTask from './tasks/ember-in-repo-addons-engines-task';
import EmberTestTypesTaskTask from './tasks/ember-test-types-task';
import EmberTypesTask from './tasks/ember-types-task';
import EmberTemplateLintDisableTask from './tasks/ember-template-lint-disable-task';
import EmberTemplateLintSummaryTask from './tasks/ember-template-lint-summary-task';
import EmberOctaneMigrationStatusTask from './tasks/ember-octane-migration-status-task';

export function register(args: RegistrationArgs) {
  let pluginName = getPluginName(__dirname);

  args.register.actions('ember-template-lint-disables', evaluateTemplateLintDisables);
  args.register.actions('ember-template-lint-summary', evaluateTemplateLintSummary);
  args.register.actions('ember-test-types', evaluateTestTypes);

  args.register.taskReporter('ember-test-types', reportEmberTestTypes);
  args.register.taskReporter('ember-octane-migration-status', reportEmberOctaneMigrationStatus);
  args.register.taskReporter('ember-template-lint-summary', reportEmberTemplateLintSummary);

  args.register.task(new EmberTypesTask(pluginName, args.context));
  args.register.task(new EmberDependenciesTask(pluginName, args.context));
  args.register.task(new EmberInRepoAddonsEnginesTask(pluginName, args.context));
  args.register.task(new EmberTestTypesTaskTask(pluginName, args.context));
  args.register.task(new EmberTemplateLintDisableTask(pluginName, args.context));
  args.register.task(new EmberTemplateLintSummaryTask(pluginName, args.context));
  args.register.task(new EmberOctaneMigrationStatusTask(pluginName, args.context));
}
