import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
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

      checkupProject.files['index.whatever'] = 'whatever';
      checkupProject.files['index.js'] = `
      // TODO: write better code
      export {};
      `;
      checkupProject.files['index.hbs'] = '{{!-- i should TODO: write code --}}';
      checkupProject.files['index.scss'] = `
      .foo {
        color: green;
      }
      .whatever {
        display: block;
        color: red;
        position: absolute;
      }
      `;

      checkupProject.writeSync();
      checkupProject.gitInit();
    });

    afterEach(() => {
      checkupProject.dispose();
    });

    it('can read project info as JSON with default config', async () => {
      let checkupConfig = mergeConfig({});

      const result = await new ProjectMetaTask(
        'meta',
        getTaskContext({
          cliFlags: { cwd: checkupProject.baseDir },
          pkg: checkupProject.pkg,
          config: checkupConfig,
          paths: checkupProject.filePaths,
        })
      ).run();
      const taskResult = <ProjectMetaTaskResult>result;

      expect(taskResult.appendCheckupProperties()).toMatchInlineSnapshot(`
        Object {
          "analyzedFiles": FilePathArray [
            ".git/HEAD",
            ".git/config",
            ".git/description",
            ".git/hooks/applypatch-msg.sample",
            ".git/hooks/commit-msg.sample",
            ".git/hooks/fsmonitor-watchman.sample",
            ".git/hooks/post-update.sample",
            ".git/hooks/pre-applypatch.sample",
            ".git/hooks/pre-commit.sample",
            ".git/hooks/pre-merge-commit.sample",
            ".git/hooks/pre-push.sample",
            ".git/hooks/pre-rebase.sample",
            ".git/hooks/pre-receive.sample",
            ".git/hooks/prepare-commit-msg.sample",
            ".git/hooks/update.sample",
            ".git/info/exclude",
            "index.hbs",
            "index.js",
            "index.scss",
            "index.whatever",
            "package.json",
          ],
          "analyzedFilesCount": 21,
          "cli": Object {
            "args": Object {
              "paths": Array [],
            },
            "config": Object {
              "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json",
              "excludePaths": Array [],
              "plugins": Array [],
              "tasks": Object {},
            },
            "configHash": "dd17cda1fc2eb2bc6bb5206b41fc1a84",
            "flags": Object {
              "config": undefined,
              "excludePaths": undefined,
              "format": "stdout",
              "outputFile": "",
              "task": undefined,
            },
            "schema": 1,
            "version": "0.0.0",
          },
          "project": Object {
            "name": "checkup-app",
            "repository": Object {
              "activeDays": "0 days",
              "age": "0 days",
              "linesOfCode": Object {
                "total": 15,
                "types": Array [
                  Object {
                    "extension": "scss",
                    "total": 10,
                  },
                  Object {
                    "extension": "js",
                    "total": 4,
                  },
                  Object {
                    "extension": "hbs",
                    "total": 1,
                  },
                ],
              },
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

      expect(result.appendCheckupProperties()).toMatchInlineSnapshot(`
        Object {
          "analyzedFiles": FilePathArray [],
          "analyzedFilesCount": 0,
          "cli": Object {
            "args": Object {
              "paths": Array [],
            },
            "config": Object {
              "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json",
              "excludePaths": Array [],
              "plugins": Array [
                "checkup-plugin-ember",
              ],
              "tasks": Object {},
            },
            "configHash": "2f97c4acdec7c73cce0b6c3e3e0cedc2",
            "flags": Object {
              "config": undefined,
              "excludePaths": undefined,
              "format": "stdout",
              "outputFile": "",
              "task": undefined,
            },
            "schema": 1,
            "version": "0.0.0",
          },
          "project": Object {
            "name": "checkup-app",
            "repository": Object {
              "activeDays": "0 days",
              "age": "0 days",
              "linesOfCode": Object {
                "total": 0,
                "types": Array [],
              },
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
