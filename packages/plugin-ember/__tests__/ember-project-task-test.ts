import { EmberProject, stdout } from '@checkup/test-helpers';
import { EmberProjectTask } from '../src/tasks';
import { EmberProjectTaskResult } from '../src/results';

describe('project-info-task', () => {
  let project: EmberProject;

  describe('for Ember Applications', () => {
    beforeEach(() => {
      let packageJson = require('./__fixtures__/app-package.json');

      project = new EmberProject('checkup-app', '0.0.0', project => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      project.updatePackageJson(packageJson);

      project.writeSync();
    });

    afterEach(() => {
      project.dispose();
    });

    it('can read project info and output to console', async () => {
      const result = await new EmberProjectTask({ path: project.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchSnapshot();
    });

    it('can read project info as JSON', async () => {
      const result = await new EmberProjectTask({ path: project.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      expect(taskResult.toJson()).toMatchSnapshot();
    });
  });

  describe('for Ember Addons', () => {
    beforeEach(() => {
      let packageJson = require('./__fixtures__/addon-package.json');

      project = new EmberProject('checkup-app', '0.0.0', project => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      project.updatePackageJson(packageJson);

      project.writeSync();
    });

    afterEach(() => {
      project.dispose();
    });

    it('can read project info and output to console', async () => {
      const result = await new EmberProjectTask({ path: project.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchSnapshot();
    });

    it('can read project info as JSON', async () => {
      const result = await new EmberProjectTask({ path: project.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      expect(taskResult.toJson()).toMatchSnapshot();
    });
  });
});
