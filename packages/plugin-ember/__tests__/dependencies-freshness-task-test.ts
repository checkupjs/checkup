import { CheckupProject, stdout } from '@checkup/test-helpers';
import DependenciesFreshnessTask from '../src/tasks/dependencies-freshness-task';
import DependenciesFreshnessTaskResult from '../src/results/dependencies-freshness-task-result';

describe('dependencies-freshness-task', () => {
  let checkupProject: CheckupProject;

  beforeEach(() => {
    checkupProject = new CheckupProject('checkup-app', '0.0.0', project => {
      project.addDependency('ember-cli', '^3.15.0');
    });

    checkupProject.writeSync();
    checkupProject.gitInit();
  });

  afterEach(() => {
    checkupProject.dispose();
  });

  it('can read task and output to console', async () => {
    const result = await new DependenciesFreshnessTask({ path: checkupProject.baseDir }).run();
    const taskResult = <DependenciesFreshnessTaskResult>result;

    taskResult.stdout();

    expect(stdout()).toMatchSnapshot();
  });

  it('can read task as JSON', async () => {
    const result = await new DependenciesFreshnessTask({ path: checkupProject.baseDir }).run();
    const taskResult = <DependenciesFreshnessTaskResult>result;

    expect(taskResult.json()).toMatchSnapshot();
  });
});
