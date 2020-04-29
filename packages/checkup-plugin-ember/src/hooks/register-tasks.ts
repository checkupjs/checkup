import EmberDependenciesTask from '../tasks/ember-dependencies-task';
import EmberTypesTask from '../tasks/ember-types-task';
import { Hook } from '@oclif/config';

const hook: Hook<'register-tasks'> = async function ({ context, tasks }: any) {
  tasks.registerTask(new EmberTypesTask(context));
  tasks.registerTask(new EmberDependenciesTask(context));
};

export default hook;
