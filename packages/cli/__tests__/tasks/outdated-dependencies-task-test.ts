import { CheckupProject, stdout } from '@checkup/test-helpers';
import OutdatedDependenciesTask from '../../src/tasks/outdated-dependencies-task';
import OutdatedDependenciesTaskResult from '../../src/results/outdated-dependencies-task-result';

describe('outdated-dependencies-task', () => {
  let checkupProject: CheckupProject;

  beforeEach(() => {
    checkupProject = new CheckupProject('checkup-app', '0.0.0', (project) => {
      project.addDependency('ember-cli', '^3.15.0');
    });

    checkupProject.writeSync();
    checkupProject.gitInit();
  });

  afterEach(() => {
    checkupProject.dispose();
  });

  it('detects outdated dependencies and output to console', async () => {
    const result = await new OutdatedDependenciesTask({ path: checkupProject.baseDir }).run();
    const taskResult = <OutdatedDependenciesTaskResult>result;

    taskResult.stdout();

    expect(stdout()).toMatchSnapshot();
  });

  it('detects outdated dependencies as JSON', async () => {
    const result = await new OutdatedDependenciesTask({ path: checkupProject.baseDir }).run();
    const taskResult = <OutdatedDependenciesTaskResult>result;

    expect(taskResult.json()).toMatchSnapshot();
  });
});
