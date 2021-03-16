import { getPluginName, RegisterTaskArgs } from '@checkup/core';

import EmberDependenciesTask from '../tasks/ember-dependencies-task';
import EmberInRepoAddonsEnginesTask from '../tasks/ember-in-repo-addons-engines-task';
import EmberTestTypesTaskTask from '../tasks/ember-test-types-task';
import EmberTypesTask from '../tasks/ember-types-task';
import EmberTemplateLintDisableTask from '../tasks/ember-template-lint-disable-task';
import EmberTemplateLintSummaryTask from '../tasks/ember-template-lint-summary-task';
import EmberOctaneMigrationStatusTask from '../tasks/ember-octane-migration-status-task';

const register = async function ({ context, tasks }: RegisterTaskArgs) {
  let pluginName = getPluginName(__dirname);

  tasks.registerTask(new EmberTypesTask(pluginName, context));
  tasks.registerTask(new EmberDependenciesTask(pluginName, context));
  tasks.registerTask(new EmberInRepoAddonsEnginesTask(pluginName, context));
  tasks.registerTask(new EmberTestTypesTaskTask(pluginName, context));
  tasks.registerTask(new EmberTemplateLintDisableTask(pluginName, context));
  tasks.registerTask(new EmberTemplateLintSummaryTask(pluginName, context));
  tasks.registerTask(new EmberOctaneMigrationStatusTask(pluginName, context));
};

export default register;
