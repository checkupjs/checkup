import { Hook } from '@oclif/config';
import { ProjectInfoTask } from '../tasks';

const hook: Hook<'register-tasks'> = async function({ registerTask }: any) {
  registerTask(ProjectInfoTask.taskName, ProjectInfoTask);
};

export default hook;
