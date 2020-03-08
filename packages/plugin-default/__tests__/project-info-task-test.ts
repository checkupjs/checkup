import { CheckupProject, stdout } from '@checkup/test-helpers';
import ProjectInfoTask from '../src/tasks/project-info-task';
import ProjectInfoTaskResult from '../src/results/project-info-task-result';

describe('project-info-task', () => {
  let checkupProject: CheckupProject;

  describe('for Projects', () => {
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

    it('can read project info and output to console', async () => {
      const result = await new ProjectInfoTask({ path: checkupProject.baseDir }).run();
      const taskResult = <ProjectInfoTaskResult>result;

      taskResult.stdout();

      expect(stdout()).toMatchSnapshot();
    });

    it('can read project info as JSON', async () => {
      const result = await new ProjectInfoTask({ path: checkupProject.baseDir }).run();
      const taskResult = <ProjectInfoTaskResult>result;

      expect(taskResult.json()).toMatchSnapshot();
    });
  });
});
