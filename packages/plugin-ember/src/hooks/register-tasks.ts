import { DependenciesTask, EmberProjectTask, TypesTask } from '../tasks';

import { Hook } from '@oclif/config';

// TODO: Determine correct type for options
const hook: Hook<'register-tasks'> = async function({ cliArguments, tasks }: any) {
  tasks.registerTask(
    EmberProjectTask.taskName,
    new EmberProjectTask(cliArguments),
    EmberProjectTask.taskClassification
  );
  tasks.registerTask(
    DependenciesTask.taskName,
    new DependenciesTask(cliArguments),
    DependenciesTask.taskClassification
  );
  tasks.registerTask(TypesTask.taskName, new TypesTask(cliArguments), TypesTask.taskClassification);
};

export default hook;
