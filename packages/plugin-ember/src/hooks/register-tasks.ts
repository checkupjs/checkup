import { DependenciesTask, ProjectInfoTask, TypesTask } from '../tasks';

import { Hook } from '@oclif/config';
import { registerTask } from '@checkup/core';

const hook: Hook<'register-tasks'> = async function() {
  registerTask(ProjectInfoTask.taskName, ProjectInfoTask);
  registerTask(DependenciesTask.taskName, DependenciesTask);
  registerTask(TypesTask.taskName, TypesTask);
};

export default hook;
