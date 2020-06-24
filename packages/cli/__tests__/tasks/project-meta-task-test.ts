import { CheckupProject, stdout, getTaskContext } from '@checkup/test-helpers';
import ProjectMetaTask from '../../src/tasks/project-meta-task';
import ProjectMetaTaskResult from '../../src/results/project-meta-task-result';

describe('project-meta-task', () => {
  let checkupProject: CheckupProject;

  describe('for Projects', () => {
    beforeEach(() => {
      checkupProject = new CheckupProject('checkup-app', '0.0.0', (project) => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      checkupProject.writeSync();
      checkupProject.gitInit();
    });

    afterEach(() => {
      checkupProject.dispose();
    });

    it('can read project info and output to console', async () => {
      const result = await new ProjectMetaTask(
        'meta',
        getTaskContext({
          cliFlags: { cwd: checkupProject.baseDir },
          pkg: checkupProject.pkg,
        })
      ).run();
      const taskResult = <ProjectMetaTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchInlineSnapshot(`
        "
        Checkup report generated for checkup-app v0.0.0

        This project is 0 days old, with 0 days active days, 0 commits and 0 files.

        "
      `);
    });

    it('can read project info as JSON', async () => {
      const result = await new ProjectMetaTask(
        'meta',
        getTaskContext({
          cliFlags: { cwd: checkupProject.baseDir },
          pkg: checkupProject.pkg,
        })
      ).run();
      const taskResult = <ProjectMetaTaskResult>result;

      expect(taskResult.toJson()).toMatchInlineSnapshot(`
        Object {
          "project": Object {
            "filesAnalyzed": 0,
            "name": "checkup-app",
            "repository": Object {
              "activeDays": "0 days",
              "age": "0 days",
              "totalCommits": 0,
              "totalFiles": 0,
            },
            "version": "0.0.0",
          },
        }
      `);
    });
  });
});
