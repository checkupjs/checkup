import EmberCLIFixturifyProject from './__utils__/ember-cli-fixturify-project';
import { ProjectInfoTask } from '../src/tasks';
import { ProjectInfoTaskResult } from '../src/results';
import { stdout } from './__utils__/stdout';

describe('project-info-task', () => {
  let fixturifyProject: EmberCLIFixturifyProject;

  describe('for Ember Applications', () => {
    beforeEach(() => {
      let packageJson = require('./__fixtures__/app-package.json');

      fixturifyProject = new EmberCLIFixturifyProject('checkup-app', '0.0.0', project => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      fixturifyProject.updatePackageJson(packageJson);

      fixturifyProject.writeSync();
    });

    afterEach(() => {
      fixturifyProject.dispose();
    });

    it('can read project info and output to console', async () => {
      const result = await new ProjectInfoTask({ path: fixturifyProject.baseDir }).run();
      const taskResult = <ProjectInfoTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchSnapshot();
    });

    it('can read project info as JSON', async () => {
      const result = await new ProjectInfoTask({ path: fixturifyProject.baseDir }).run();
      const taskResult = <ProjectInfoTaskResult>result;

      expect(taskResult.toJson()).toMatchSnapshot();
    });
  });

  describe('for Ember Addons', () => {
    beforeEach(() => {
      let packageJson = require('./__fixtures__/addon-package.json');

      fixturifyProject = new EmberCLIFixturifyProject('checkup-app', '0.0.0', project => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      fixturifyProject.updatePackageJson(packageJson);

      fixturifyProject.writeSync();
    });

    afterEach(() => {
      fixturifyProject.dispose();
    });

    it('can read project info and output to console', async () => {
      const result = await new ProjectInfoTask({ path: fixturifyProject.baseDir }).run();
      const taskResult = <ProjectInfoTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchSnapshot();
    });

    it('can read project info as JSON', async () => {
      const result = await new ProjectInfoTask({ path: fixturifyProject.baseDir }).run();
      const taskResult = <ProjectInfoTaskResult>result;

      expect(taskResult.toJson()).toMatchSnapshot();
    });
  });
});
