import { EmberProject, stdout } from '@checkup/test-helpers';

import { DependenciesTask } from '../src/tasks';
import { DependenciesTaskResult } from '../src/results';

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
    const result = await new DependenciesTask({ path: emberProject.baseDir }).run();
    const dependencyTaskResult = <DependenciesTaskResult>result;

    dependencyTaskResult.stdout();

    expect(stdout()).toMatchSnapshot();
  });

  it('detects Ember dependencies as JSON', async () => {
    const result = await new DependenciesTask({ path: emberProject.baseDir }).run();
    const dependencyTaskResult = <DependenciesTaskResult>result;

    expect(dependencyTaskResult.json()).toMatchSnapshot();
  });
});
