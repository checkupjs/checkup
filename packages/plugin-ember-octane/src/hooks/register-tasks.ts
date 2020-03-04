import { OctaneMigrationStatusTask } from '../tasks';
import { Hook } from '@oclif/config';

// TODO: Determine correct type for options
const hook: Hook<'register-tasks'> = async function({ cliArguments, tasks }: any) {
  tasks.registerTask(
    OctaneMigrationStatusTask.taskName,
    new OctaneMigrationStatusTask(cliArguments),
    OctaneMigrationStatusTask.taskClassification
  );
};

export default hook;
