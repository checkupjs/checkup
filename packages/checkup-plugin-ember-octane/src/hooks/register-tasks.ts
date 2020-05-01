import { Hook } from '@oclif/config';
import OctaneMigrationStatusTask from '../tasks/octane-migration-status-task';

const hook: Hook<'register-tasks'> = async function ({ context, tasks }: any) {
  tasks.registerTask(new OctaneMigrationStatusTask(context));
};

export default hook;
