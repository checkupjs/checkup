import { CheckupProject, stdout, getTaskContext } from '@checkup/test-helpers';
import ProjectMetaTask from '../../src/tasks/project-meta-task';
import ProjectMetaTaskResult from '../../src/results/project-meta-task-result';
import { mergeConfig } from '@checkup/core';

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

    it('can read project info and output to console with default config', async () => {
      let checkupConfig = mergeConfig({});

      const result = await new ProjectMetaTask(
        'meta',
        getTaskContext({
          cliFlags: { cwd: checkupProject.baseDir },
          pkg: checkupProject.pkg,
          config: checkupConfig,
        })
      ).run();
      const taskResult = <ProjectMetaTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchInlineSnapshot(`
        "
        Checkup report generated for checkup-app v0.0.0

        This project is 0 days old, with 0 days active days, 0 commits and 0 files.

        checkup v0.0.0
        config 395b15f7dea0dee193db593e1c6cfb5b

        "
      `);
    });

    it('can read project info and output to console with custom config', async () => {
      let checkupConfig = mergeConfig({
        plugins: ['checkup-plugin-ember'],
        tasks: {},
      });

      const result = await new ProjectMetaTask(
        'meta',
        getTaskContext({
          cliFlags: { cwd: checkupProject.baseDir },
          pkg: checkupProject.pkg,
          config: checkupConfig,
        })
      ).run();
      const taskResult = <ProjectMetaTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchInlineSnapshot(`
        "
        Checkup report generated for checkup-app v0.0.0

        This project is 0 days old, with 0 days active days, 0 commits and 0 files.

        checkup v0.0.0
        config 1ba2bd62ba89147967dc57decae6b129

        "
      `);
    });

    it('can read project info as JSON with default config', async () => {
      let checkupConfig = mergeConfig({});

      const result = await new ProjectMetaTask(
        'meta',
        getTaskContext({
          cliFlags: { cwd: checkupProject.baseDir },
          pkg: checkupProject.pkg,
          config: checkupConfig,
        })
      ).run();
      const taskResult = <ProjectMetaTaskResult>result;

      expect(taskResult.toJson()).toMatchInlineSnapshot(`
        Object {
          "analyzedFilesCount": FilePathArray [],
          "cli": Object {
            "configHash": "395b15f7dea0dee193db593e1c6cfb5b",
            "schema": 1,
            "version": "0.0.0",
          },
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
        }
      `);
    });

    it('can read project info as JSON with custom config', async () => {
      let checkupConfig = mergeConfig({
        plugins: ['checkup-plugin-ember'],
        tasks: {},
      });

      const result = await new ProjectMetaTask(
        'meta',
        getTaskContext({
          cliFlags: { cwd: checkupProject.baseDir },
          pkg: checkupProject.pkg,
          config: checkupConfig,
        })
      ).run();
      const taskResult = <ProjectMetaTaskResult>result;

      expect(taskResult.toJson()).toMatchInlineSnapshot(`
        Object {
          "analyzedFilesCount": FilePathArray [],
          "cli": Object {
            "configHash": "1ba2bd62ba89147967dc57decae6b129",
            "schema": 1,
            "version": "0.0.0",
          },
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
        }
      `);
    });
  });
});
