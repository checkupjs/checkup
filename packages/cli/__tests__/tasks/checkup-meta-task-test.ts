import { CheckupProject, stdout, getTaskContext } from '@checkup/test-helpers';
import CheckupMetaTask from '../../src/tasks/checkup-meta-task';
import CheckupMetaTaskResult from '../../src/results/checkup-meta-task-result';
import { CheckupConfig } from '@checkup/core';

const DEFAULT_CONFIG = {
  plugins: [],
  tasks: {},
};

async function getConfig(config: Partial<CheckupConfig> = {}) {
  return { ...config, ...DEFAULT_CONFIG };
}

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
      let checkupConfig = await getConfig();

      const result = await new CheckupMetaTask(
        'meta',
        getTaskContext({}, { cwd: project.baseDir }, checkupConfig)
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchInlineSnapshot(`
        "checkup v0.0.0
        config ae3266e319bdfb51db83810a2f4dd161

        "
      `);
    });

    it('can read checkup meta as JSON with default config', async () => {
      let checkupConfig = await getConfig();

      const result = await new CheckupMetaTask(
        'meta',
        getTaskContext({}, { cwd: project.baseDir }, checkupConfig)
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      expect(taskResult.toJson()).toMatchInlineSnapshot(`
        Object {
          "checkup": Object {
            "configHash": "ae3266e319bdfb51db83810a2f4dd161",
            "version": "0.0.0",
          },
        }
      `);
    });

    it('can read checkup meta and output to console', async () => {
      let checkupConfig = await getConfig({
        plugins: ['checkup-plugin-ember'],
        tasks: {},
      });

      const result = await new CheckupMetaTask(
        'meta',
        getTaskContext({}, { cwd: project.baseDir }, checkupConfig)
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      taskResult.toConsole();

      expect(stdout()).toMatchInlineSnapshot(`
        "checkup v0.0.0
        config ae3266e319bdfb51db83810a2f4dd161

        "
      `);
    });

    it('can read checkup meta as JSON', async () => {
      let checkupConfig = await getConfig({
        plugins: ['checkup-plugin-ember'],
        tasks: {},
      });

      const result = await new CheckupMetaTask(
        'meta',
        getTaskContext({}, { cwd: project.baseDir }, checkupConfig)
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      expect(taskResult.toJson()).toMatchInlineSnapshot(`
        Object {
          "checkup": Object {
            "configHash": "ae3266e319bdfb51db83810a2f4dd161",
            "version": "0.0.0",
          },
        }
      `);
    });
  });
});
