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
        config 3720546166a5955def89f6bf69895976

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
            "configHash": "3720546166a5955def89f6bf69895976",
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
        config 808e6414226ddef62caa9eba3755c3aa

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
            "configHash": "808e6414226ddef62caa9eba3755c3aa",
            "version": "0.0.0",
          },
        }
      `);
    });
  });
});
