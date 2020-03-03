import { DependenciesTask, EmberProjectTask, TypesTask } from '../tasks';

import { Hook } from '@oclif/config';

// TODO: Determine correct type for options
const hook: Hook<'register-tasks'> = async function({ cliArguments, tasks }: any) {
  tasks.registerTask(new EmberProjectTask(cliArguments));
  tasks.registerTask(new DependenciesTask(cliArguments));
  tasks.registerTask(new TypesTask(cliArguments));
};

export default hook;
