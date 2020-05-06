import EmberDependenciesTask from '../tasks/ember-dependencies-task';
import EmberInRepoAddonsEnginesTask from '../tasks/ember-in-repo-addons-engines-task';
import EmberTestTypesTaskTask from '../tasks/ember-test-types-task';
import EmberTypesTask from '../tasks/ember-types-task';
import { Hook } from '@oclif/config';
import { getPluginName } from '@checkup/core';

const hook: Hook<'register-tasks'> = async function ({ context, tasks }: any) {
  let pluginName = getPluginName(__dirname);

  tasks.registerTask(new EmberTypesTask(pluginName, context));
  tasks.registerTask(new EmberDependenciesTask(pluginName, context));
  tasks.registerTask(new EmberInRepoAddonsEnginesTask(pluginName, context));
  tasks.registerTask(new EmberTestTypesTaskTask(pluginName, context));
};

export default hook;
