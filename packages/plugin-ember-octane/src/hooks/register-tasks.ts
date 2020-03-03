import { JSMigrationStatusTask } from '../tasks';
import { Hook } from '@oclif/config';

// TODO: Determine correct type for options
const hook: Hook<'register-tasks'> = async function({ cliArguments, tasks }: any) {
  tasks.registerTask(
    JSMigrationStatusTask.taskName,
    new JSMigrationStatusTask(cliArguments),
    JSMigrationStatusTask.taskClassification
  );
};

export default hook;
