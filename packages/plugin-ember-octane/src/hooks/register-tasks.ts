import { Hook } from '@oclif/config';
import OctaneMigrationStatusTask from '../tasks/octane-migration-status-task';

// TODO: Determine correct type for options
const hook: Hook<'register-tasks'> = async function ({ cliArguments, parsers, tasks }: any) {
  tasks.registerTask(new OctaneMigrationStatusTask(cliArguments, parsers));
};

export default hook;
