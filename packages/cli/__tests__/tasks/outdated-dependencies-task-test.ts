import { CheckupProject, stdout, getTaskContext } from '@checkup/test-helpers';
import OutdatedDependenciesTask from '../../src/tasks/outdated-dependencies-task';
import OutdatedDependenciesTaskResult from '../../src/results/outdated-dependencies-task-result';

describe('outdated-dependencies-task', () => {
  let project: CheckupProject;

  beforeEach(() => {
    project = new CheckupProject('checkup-app', '0.0.0', (project) => {
      project.addDependency('react', '^15.0.0');
      project.addDependency('react-dom', '^15.0.0');
    });

    project.writeSync();
    project.gitInit();
    project.install();
  });

  afterEach(() => {
    project.dispose();
  });

  it('detects outdated dependencies and output to console', async () => {
    const result = await new OutdatedDependenciesTask(
      'meta',
      getTaskContext({
        cliFlags: { cwd: project.baseDir },
        pkg: project.pkg,
      })
    ).run();
    const taskResult = <OutdatedDependenciesTaskResult>result;

    taskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('detects outdated dependencies as JSON', async () => {
    const result = await new OutdatedDependenciesTask(
      'meta',
      getTaskContext({
        cliFlags: { cwd: project.baseDir },
        pkg: project.pkg,
      })
    ).run();
    const taskResult = <OutdatedDependenciesTaskResult>result;

    expect(taskResult.toJson()).toMatchSnapshot();
  });
});
