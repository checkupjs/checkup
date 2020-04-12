import EmberDependenciesTask from '../tasks/ember-dependencies-task';
import EmberInRepoAddonsEnginesTask from '../tasks/ember-in-repo-addons-engines-task';
import EmberTypesTask from '../tasks/ember-types-task';
import DependenciesFreshnessTask from '../tasks/dependencies-freshness-task';
import { Hook } from '@oclif/config';
import { getPluginName } from '@checkup/core';

const hook: Hook<'register-tasks'> = async function ({ context, tasks }: any) {
  let pluginName = getPluginName(__dirname);

  tasks.registerTask(new EmberTypesTask(pluginName, context));
  tasks.registerTask(new EmberDependenciesTask(pluginName, context));
  tasks.registerTask(new EmberInRepoAddonsEnginesTask(pluginName, context));
  tasks.registerTask(new DependenciesFreshnessTask(cliArguments));
};

export default hook;
