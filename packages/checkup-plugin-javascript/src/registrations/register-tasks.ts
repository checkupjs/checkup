import { getPluginName, RegisterTaskArgs } from '@checkup/core';

import EslintDisableTask from '../tasks/eslint-disable-task';
import OutdatedDependencyTask from '../tasks/outdated-dependencies-task';
import { EslintSummaryTask } from '../tasks/eslint-summary-task';

const register = async function ({ context, tasks }: RegisterTaskArgs) {
  let pluginName = getPluginName(__dirname);

  tasks.registerTask(new EslintSummaryTask(pluginName, context));
  tasks.registerTask(new EslintDisableTask(pluginName, context));
  tasks.registerTask(new OutdatedDependencyTask(pluginName, context));
};

export default register;
