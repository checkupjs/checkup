import EmberCLIFixturifyProject from './__utils__/ember-cli-fixturify-project';
import { stdout } from './__utils__/stdout';

import { DependenciesTask } from '../src/tasks';
import { DependenciesTaskResult } from '../src/results';

describe('dependencies-task', () => {
  let fixturifyProject: EmberCLIFixturifyProject;

  beforeEach(function() {
    fixturifyProject = new EmberCLIFixturifyProject('checkup-app', '0.0.0', project => {
      project.addDependency('ember-source', '^3.15.0');
      project.addDependency('ember-cli', '^3.15.0');
      project.addDevDependency('ember-cli-string-utils', 'latest');
      project.addAddon('ember-cli-blueprint-test-helpers', 'latest');
    });

    fixturifyProject.writeSync();
  });

  afterEach(function() {
    fixturifyProject.dispose();
  });

  it('detects dependencies', async () => {
    const result = await new DependenciesTask({ path: fixturifyProject.baseDir }).run();
    const dependencyTaskResult = <DependenciesTaskResult>result;

    dependencyTaskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('detects dependencies', async () => {
    const result = await new DependenciesTask({ path: fixturifyProject.baseDir }).run();
    const dependencyTaskResult = <DependenciesTaskResult>result;

    expect(dependencyTaskResult.toJson()).toMatchSnapshot();
  });
});
