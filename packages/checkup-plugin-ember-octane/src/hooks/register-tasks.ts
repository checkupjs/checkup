import { Hook } from '@oclif/config';
import OctaneMigrationStatusTask from '../tasks/octane-migration-status-task';
import { getPluginName } from '@checkup/core';

const hook: Hook<'register-tasks'> = async function ({ context, tasks }: any) {
  let pluginName = getPluginName(__dirname);

  tasks.registerTask(new OctaneMigrationStatusTask(pluginName, context));
};

export default hook;
