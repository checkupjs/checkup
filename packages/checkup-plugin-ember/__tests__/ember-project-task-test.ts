import { EmberProject, stdout } from '@checkup/test-helpers';
import { EmberProjectTask } from '../src/tasks';
import { EmberProjectTaskResult } from '../src/results';

describe('project-info-task', () => {
  let emberProject: EmberProject;

  describe('for Ember Applications', () => {
    beforeEach(() => {
      let packageJson = require('./__fixtures__/app-package.json');

      emberProject = new EmberProject('checkup-app', '0.0.0', (project) => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      emberProject.updatePackageJson(packageJson);

      emberProject.writeSync();
    });

    afterEach(() => {
      emberProject.dispose();
    });

    it('can read project info and output to console', async () => {
      const result = await new EmberProjectTask({ path: emberProject.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      taskResult.stdout();

      expect(stdout()).toMatchSnapshot();
    });

    it('can read project info as JSON', async () => {
      const result = await new EmberProjectTask({ path: emberProject.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      expect(taskResult.json()).toMatchSnapshot();
    });

    it('can read project info as PDF', async () => {
      const result = await new EmberProjectTask({ path: emberProject.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      expect(taskResult.pdf()).toMatchSnapshot();
    });
  });

  describe('for Ember Addons', () => {
    beforeEach(() => {
      let packageJson = require('./__fixtures__/addon-package.json');

      emberProject = new EmberProject('checkup-app', '0.0.0', (project) => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      emberProject.updatePackageJson(packageJson);

      emberProject.writeSync();
    });

    afterEach(() => {
      emberProject.dispose();
    });

    it('can read project info and output to console', async () => {
      const result = await new EmberProjectTask({ path: emberProject.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      taskResult.stdout();

      expect(stdout()).toMatchSnapshot();
    });

    it('can read project info as JSON', async () => {
      const result = await new EmberProjectTask({ path: emberProject.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      expect(taskResult.json()).toMatchSnapshot();
    });

    it('can read project info as PDF', async () => {
      const result = await new EmberProjectTask({ path: emberProject.baseDir }).run();
      const taskResult = <EmberProjectTaskResult>result;

      expect(taskResult.pdf()).toMatchSnapshot();
    });
  });
});
