import { EmberProject, stdout, getTaskContext } from '@checkup/test-helpers';

import EmberDependenciesTask from '../src/tasks/ember-dependencies-task';
import EmberDependenciesTaskResult from '../src/results/ember-dependencies-task-result';

describe('dependencies-task', () => {
  let emberProject: EmberProject;

  beforeEach(function () {
    emberProject = new EmberProject('checkup-app', '0.0.0', (project) => {
      project.addDependency('ember-source', '^3.15.0');
      project.addDependency('ember-cli', '^3.15.0');
      project.addDevDependency('ember-cli-string-utils', 'latest');
    });

    emberProject.addAddon('ember-cli-blueprint-test-helpers', 'latest');
    emberProject.writeSync();
  });

  afterEach(function () {
    emberProject.dispose();
  });

  it('detects Ember dependencies', async () => {
    const result = await new EmberDependenciesTask(
      getTaskContext({ path: emberProject.baseDir })
    ).run();
    const dependencyTaskResult = <EmberDependenciesTaskResult>result;

    dependencyTaskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('detects Ember dependencies as JSON', async () => {
    const result = await new EmberDependenciesTask(
      getTaskContext({ path: emberProject.baseDir })
    ).run();
    const dependencyTaskResult = <EmberDependenciesTaskResult>result;

    expect(dependencyTaskResult.toJson()).toMatchSnapshot();
  });

  it('detects Ember dependencies for html, and doesnt create a table without dependencies', async () => {
    const result = await new EmberDependenciesTask(
      getTaskContext({ path: emberProject.baseDir })
    ).run();
    const dependencyTaskResult = <EmberDependenciesTaskResult>result;
    const htmlResults = dependencyTaskResult.toReportData();

    expect(htmlResults).toMatchSnapshot();
    expect(htmlResults).toHaveLength(4);
  });
});
