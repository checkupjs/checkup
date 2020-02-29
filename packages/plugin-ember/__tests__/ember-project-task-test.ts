import { Project, stdout } from '@checkup/test-helpers';
import { EmberProjectTask } from '../src/tasks';
import { EmberProjectTaskResult } from '../src/results';

describe('project-info-task', () => {
  let fixturifyProject: Project;

  describe('for Ember Applications', () => {
    beforeEach(() => {
      let packageJson = require('./__fixtures__/app-package.json');

      fixturifyProject = new Project('checkup-app', '0.0.0', project => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      fixturifyProject.updatePackageJson(packageJson);

      fixturifyProject.writeSync();
    });

    afterEach(() => {
      fixturifyProject.dispose();
    });

    it('can read project info and output to console', async () => {
      const result = await new EmberProjectTask({ path: fixturifyProject.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchSnapshot();
    });

    it('can read project info as JSON', async () => {
      const result = await new EmberProjectTask({ path: fixturifyProject.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      expect(taskResult.toJson()).toMatchSnapshot();
    });
  });

  describe('for Ember Addons', () => {
    beforeEach(() => {
      let packageJson = require('./__fixtures__/addon-package.json');

      fixturifyProject = new Project('checkup-app', '0.0.0', project => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      fixturifyProject.updatePackageJson(packageJson);

      fixturifyProject.writeSync();
    });

    afterEach(() => {
      fixturifyProject.dispose();
    });

    it('can read project info and output to console', async () => {
      const result = await new EmberProjectTask({ path: fixturifyProject.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchSnapshot();
    });

    it('can read project info as JSON', async () => {
      const result = await new EmberProjectTask({ path: fixturifyProject.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      expect(taskResult.toJson()).toMatchSnapshot();
    });
  });
});
