import { CheckupProject, stdout } from '@checkup/test-helpers';
import CheckupMetaTask from '../../src/tasks/checkup-meta-task';
import CheckupMetaTaskResult from '../../src/results/checkup-meta-task-result';
import { CheckupConfig, CheckupConfigFormat, CheckupConfigService } from '@checkup/core';

const defaultConfig = {
  plugins: [],
  tasks: {},
};

async function getConfig(config: CheckupConfig = defaultConfig) {
  const configService = await CheckupConfigService.load(async () => ({
    filepath: '.',
    config,
    format: CheckupConfigFormat.JSON,
  }));

  return configService.get();
}

describe('checkup-meta-task', () => {
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

    it('can read checkup meta and output to console with default config', async () => {
      let checkupConfig = await getConfig();

      const result = await new CheckupMetaTask(
        { path: checkupProject.baseDir },
        checkupConfig
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      taskResult.stdout();

      expect(stdout()).toMatchInlineSnapshot(`
        "=== Checkup Configuration
        configHash: ae3266e319bdfb51db83810a2f4dd161
        version:    0.0.0

        "
      `);
    });

    it('can read checkup meta as JSON with default config', async () => {
      let checkupConfig = await getConfig();

      const result = await new CheckupMetaTask(
        { path: checkupProject.baseDir },
        checkupConfig
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      expect(taskResult.json()).toMatchInlineSnapshot(`
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
        { path: checkupProject.baseDir },
        checkupConfig
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      taskResult.stdout();

      expect(stdout()).toMatchInlineSnapshot(`
        "=== Checkup Configuration
        configHash: 705deefb6abf2b6d34f93cede7acba07
        version:    0.0.0

        "
      `);
    });

    it('can read checkup meta as JSON', async () => {
      let checkupConfig = await getConfig({
        plugins: ['checkup-plugin-ember'],
        tasks: {},
      });

      const result = await new CheckupMetaTask(
        { path: checkupProject.baseDir },
        checkupConfig
      ).run();
      const taskResult = <CheckupMetaTaskResult>result;

      expect(taskResult.json()).toMatchInlineSnapshot(`
        Object {
          "checkup": Object {
            "configHash": "705deefb6abf2b6d34f93cede7acba07",
            "version": "0.0.0",
          },
        }
      `);
    });
  });
});
