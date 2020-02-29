import { CheckupProject, stdout } from '@checkup/test-helpers';
import ProjectInfoTask from '../src/tasks/project-info-task';
import ProjectInfoTaskResult from '../src/results/project-info-task-result';

describe('project-info-task', () => {
  let fixturifyProject: CheckupProject;

  describe('for Projects', () => {
    beforeEach(() => {
      fixturifyProject = new CheckupProject('checkup-app', '0.0.0', project => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      fixturifyProject.writeSync();
      fixturifyProject.gitInit();
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
