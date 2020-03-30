import { CheckupProject, stdout } from '@checkup/test-helpers';
import ProjectMetaTask from '../../src/tasks/project-meta-task';
import ProjectMetaTaskResult from '../../src/results/project-meta-task-result';

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
      const result = await new ProjectMetaTask({ path: checkupProject.baseDir }).run();
      const taskResult = <ProjectMetaTaskResult>result;

      taskResult.stdout();

      expect(stdout()).toMatchInlineSnapshot(`
        "=== Project
        name:    checkup-app
        version: 0.0.0

        === Repository Information
        Active days:   0 days
        Age:           0 days
        Total commits: 0
        Total files:   0

        "
      `);
    });

    it('can read project info as JSON', async () => {
      const result = await new ProjectMetaTask({ path: checkupProject.baseDir }).run();
      const taskResult = <ProjectMetaTaskResult>result;

      expect(taskResult.json()).toMatchInlineSnapshot(`
        Object {
          "meta": Object {
            "friendlyTaskName": "Project",
            "taskClassification": Object {
              "category": "meta",
              "priority": "high",
            },
            "taskName": "project",
          },
          "result": Object {
            "project": Object {
              "name": "checkup-app",
              "repository": Object {
                "activeDays": "0 days",
                "age": "0 days",
                "totalCommits": 0,
                "totalFiles": 0,
              },
              "version": "0.0.0",
            },
          },
        }
      `);
    });
  });
});
