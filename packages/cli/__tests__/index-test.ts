import { CheckupProject, Plugin, stdout } from '@checkup/test-helpers';

import { CheckupConfig } from '@checkup/core';

import cmd = require('../src');

describe('@checkup/cli', () => {
  describe('normal cli output with plugins', () => {
    let project: CheckupProject;

    beforeEach(function() {
      const plugin = new Plugin.PluginBuilder('@checkup/plugin-mock')
        .addTask('MockTask', {
          taskName: 'mock-task',
          friendlyTaskName: 'Mock Task',
          taskClassification: {
            category: 0,
            priority: 0,
          },

          async run() {
            return Promise.resolve({
              toJson() {
                return {
                  mockTask: 5,
                };
              },
              toConsole() {
                process.stdout.write('mock task is being run\n');
              },
            });
          },
        })
        .addTask('MockTask2', {
          taskName: 'mock-task2',
          friendlyTaskName: 'Mock Task 2',
          taskClassification: {
            category: 0,
            priority: 0,
          },

          async run() {
            return Promise.resolve({
              toJson() {
                return {
                  mockTask2: 10,
                };
              },
              toConsole() {
                process.stdout.write('mock task2 is being run\n');
              },
            });
          },
        })
        .build();

      project = new CheckupProject('checkup-project', '0.0.0')
        .addCheckupConfig({
          plugins: ['@checkup/plugin-mock'],
          tasks: {},
        })
        .addPlugin(plugin);

      project.writeSync();
    });

    afterEach(function() {
      project.dispose();
    });

    it('should output checkup result', async () => {
      await cmd.run([project.baseDir]);

      expect(stdout()).toMatchSnapshot();
    });

    it('should output checkup result in JSON', async () => {
      await cmd.run(['--json', project.baseDir]);

      expect(stdout()).toMatchSnapshot();
    });

    it('should run a single task if the task option is specified', async () => {
      await cmd.run(['--task', 'mock-task', project.baseDir]);

      expect(stdout()).toMatchSnapshot();
    });
  });

  describe('cli error cases', () => {
    it('should error if no checkup config is present', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0');
      project.writeSync();

      await expect(cmd.run([project.baseDir])).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Could not find a checkup configuration starting from the given path: ${project.baseDir}. See https://github.com/checkupjs/checkup/tree/master/packages/cli#configuration for more info on how to setup a configuration."`
      );

      project.dispose();
    });

    it('should error if a plugin cannot be loaded', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0').addCheckupConfig({
        plugins: ['@checkup/unknown-plugin'],
        tasks: {},
      });
      project.writeSync();

      await expect(cmd.run([project.baseDir])).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Cannot find module '@checkup/unknown-plugin' from '${project.baseDir}'"`
      );

      project.dispose();
    });

    it('should error if the config is malformed', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0').addCheckupConfig(({
        plugins: undefined,
        tasks: {
          someTask: {
            isEnabled: 'foo',
          },
        },
      } as unknown) as CheckupConfig);
      project.writeSync();

      await expect(cmd.run([project.baseDir])).rejects.toThrowErrorMatchingSnapshot();

      project.dispose();
    });
  });
});
