import { RegistrationArgs, getPluginName } from '@checkup/core';

import { evaluateActions as evaluateTemplateLintDisables } from './actions/ember-template-lint-disable-actions';
import { evaluateActions as evaluateTemplateLintSummary } from './actions/ember-template-lint-summary-actions';
import { evaluateActions as evaluateTestTypes } from './actions/ember-test-types-actions';
import { format as reportEmberTestTypes } from './formatters/ember-test-types-formatter';
import { format as reportEmberOctaneMigrationStatus } from './formatters/ember-octane-migration-status-formatter';
import { format as reportEmberTemplateLintSummary } from './formatters/ember-template-lint-summary-formatter';
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

  args.register.taskFormatter('ember-test-types', reportEmberTestTypes);
  args.register.taskFormatter('ember-octane-migration-status', reportEmberOctaneMigrationStatus);
  args.register.taskFormatter('ember-template-lint-summary', reportEmberTemplateLintSummary);

  args.register.task(new EmberTypesTask(pluginName, args.context));
  args.register.task(new EmberDependenciesTask(pluginName, args.context));
  args.register.task(new EmberInRepoAddonsEnginesTask(pluginName, args.context));
  args.register.task(new EmberTestTypesTaskTask(pluginName, args.context));
  args.register.task(new EmberTemplateLintDisableTask(pluginName, args.context));
  args.register.task(new EmberTemplateLintSummaryTask(pluginName, args.context));
  args.register.task(new EmberOctaneMigrationStatusTask(pluginName, args.context));
}
