import { CheckupProject, stdout, getTaskContext } from '@checkup/test-helpers';
import CheckupMetaTask from '../../src/tasks/checkup-meta-task';
import CheckupMetaTaskResult from '../../src/results/checkup-meta-task-result';
import { mergeConfig } from '@checkup/core';

describe('checkup-meta-task', () => {
  let project: CheckupProject;

  describe('for Projects', () => {
    beforeEach(() => {
      project = new CheckupProject('checkup-app', '0.0.0', (project) => {
        project.addDependency('ember-cli', '^3.15.0');
      });

      project.writeSync();
      project.gitInit();
    });

    afterEach(() => {
      project.dispose();
    });

    it('can read checkup meta and output to console with default config', async () => {
      let checkupConfig = mergeConfig({});

      const result = await new CheckupMetaTask(
        'meta',
        getTaskContext({ cliFlags: { cwd: project.baseDir }, config: checkupConfig })
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchInlineSnapshot(`
        "checkup v0.0.0
        config 395b15f7dea0dee193db593e1c6cfb5b

        "
      `);
    });

    it('can read checkup meta as JSON with default config', async () => {
      let checkupConfig = mergeConfig({});

      const result = await new CheckupMetaTask(
        'meta',
        getTaskContext({ cliFlags: { cwd: project.baseDir }, config: checkupConfig })
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      expect(taskResult.toJson()).toMatchInlineSnapshot(`
        Object {
          "checkup": Object {
            "configHash": "395b15f7dea0dee193db593e1c6cfb5b",
            "version": "0.0.0",
          },
        }
      `);
    });

    it('can read checkup meta and output to console', async () => {
      let checkupConfig = mergeConfig({
        plugins: ['checkup-plugin-ember'],
        tasks: {},
      });

      const result = await new CheckupMetaTask(
        'meta',
        getTaskContext({ cliFlags: { cwd: project.baseDir }, config: checkupConfig })
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchInlineSnapshot(`
        "checkup v0.0.0
        config 1ba2bd62ba89147967dc57decae6b129

        "
      `);
    });

    it('can read checkup meta as JSON', async () => {
      let checkupConfig = mergeConfig({
        plugins: ['checkup-plugin-ember'],
        tasks: {},
      });

      const result = await new CheckupMetaTask(
        'meta',
        getTaskContext({ cliFlags: { cwd: project.baseDir }, config: checkupConfig })
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      expect(taskResult.toJson()).toMatchInlineSnapshot(`
        Object {
          "checkup": Object {
            "configHash": "1ba2bd62ba89147967dc57decae6b129",
            "version": "0.0.0",
          },
        }
      `);
    });
  });
});
