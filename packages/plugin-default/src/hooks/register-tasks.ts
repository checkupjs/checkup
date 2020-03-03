import { Hook } from '@oclif/config';
import { ProjectInfoTask } from '../tasks';

const hook: Hook<'register-tasks'> = async function({ cliArguments, tasks }: any) {
  tasks.registerTask(new ProjectInfoTask(cliArguments));
};

export default hook;
