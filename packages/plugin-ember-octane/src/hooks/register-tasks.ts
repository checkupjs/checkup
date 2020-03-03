import { MigrationStatusTask } from '../tasks';
import { Hook } from '@oclif/config';

// TODO: Determine correct type for options
const hook: Hook<'register-tasks'> = async function({ cliArguments, tasks, parsers }: any) {
  tasks.registerTask(
    MigrationStatusTask.taskName,
    new MigrationStatusTask(cliArguments, parsers),
    MigrationStatusTask.taskClassification
  );
};

export default hook;
