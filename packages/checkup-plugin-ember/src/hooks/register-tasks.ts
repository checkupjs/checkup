import EmberDependenciesTask from '../tasks/ember-dependencies-task';
import EmberTypesTask from '../tasks/ember-types-task';
import { Hook } from '@oclif/config';
import { getPluginName } from '@checkup/core';

const hook: Hook<'register-tasks'> = async function ({ context, tasks }: any) {
  let pluginName = getPluginName(__dirname);

  tasks.registerTask(new EmberTypesTask(pluginName, context));
  tasks.registerTask(new EmberDependenciesTask(pluginName, context));
};

export default hook;
