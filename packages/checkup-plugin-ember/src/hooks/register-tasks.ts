import EmberDependenciesTask from '../tasks/ember-dependencies-task';
import EmberTypesTask from '../tasks/ember-types-task';
import { Hook } from '@oclif/config';

const hook: Hook<'register-tasks'> = async function ({ cliArguments, tasks }: any) {
  tasks.registerTask(new EmberTypesTask(cliArguments));
  tasks.registerTask(new EmberDependenciesTask(cliArguments));
};

export default hook;
