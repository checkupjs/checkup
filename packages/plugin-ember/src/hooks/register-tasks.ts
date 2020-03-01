import { DependenciesTask, EmberProjectTask, TypesTask } from '../tasks';

import { Hook } from '@oclif/config';

// TODO: Determine correct type for options
const hook: Hook<'register-tasks'> = async function({ cliArguments, tasks }: any) {
  tasks.registerTask(EmberProjectTask.taskName, new EmberProjectTask(cliArguments));
  tasks.registerTask(DependenciesTask.taskName, new DependenciesTask(cliArguments));
  tasks.registerTask(TypesTask.taskName, new TypesTask(cliArguments));
};

export default hook;
