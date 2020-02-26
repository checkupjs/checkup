import { JSMigrationStatusTask } from '../tasks';
import { Hook } from '@oclif/config';

// TODO: Determine correct type for options
const hook: Hook<'register-tasks'> = async function({ registerTask }: any) {
  registerTask(JSMigrationStatusTask.taskName, JSMigrationStatusTask);
};

export default hook;
