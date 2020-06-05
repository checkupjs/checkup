import EslintDisableTask from '../tasks/eslint-disable-task';
import OutdatedDependencyTask from '../tasks/outdated-dependencies-task';
import { Hook } from '@oclif/config';
import { getPluginName } from '@checkup/core';

const hook: Hook<'register-tasks'> = async function ({ context, tasks }: any) {
  let pluginName = getPluginName(__dirname);

  tasks.registerTask(new EslintDisableTask(pluginName, context));
  tasks.registerTask(new OutdatedDependencyTask(pluginName, context));
};

export default hook;
