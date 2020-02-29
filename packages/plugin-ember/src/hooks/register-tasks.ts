import { DependenciesTask, EmberProjectTask, TypesTask } from '../tasks';

import { Hook } from '@oclif/config';

// TODO: Determine correct type for options
const hook: Hook<'register-tasks'> = async function({ registerTask }: any) {
  registerTask(EmberProjectTask.taskName, EmberProjectTask);
  registerTask(DependenciesTask.taskName, DependenciesTask);
  registerTask(TypesTask.taskName, TypesTask);
};

export default hook;
