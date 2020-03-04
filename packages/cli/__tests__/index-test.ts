import { CheckupConfig, Task } from '@checkup/core';
import { CheckupProject, Plugin, stdout } from '@checkup/test-helpers';
import * as path from 'path';

import cmd = require('../src');

describe('@checkup/cli', () => {
  describe('normal cli output with plugins', () => {
    let project: CheckupProject;

    beforeEach(function() {
      const plugin = new Plugin('@checkup/plugin-mock')
        .addTask(
          class MockTask implements Task {
            taskName = 'mock-task';
            friendlyTaskName = 'Mock Task';
            taskClassification = {
              category: 0,
              priority: 0,
            };

            async run() {
              return {
                toJson() {
                  return {
                    mockTask: 5,
                  };
                },
                toConsole() {
                  process.stdout.write('mock task is being run\n');
                },
              };
            }
          }
        )
        .addTask(
          class MockTask2 implements Task {
            taskName = 'mock-task2';
            friendlyTaskName = 'Mock Task 2';
            taskClassification = {
              category: 0,
              priority: 0,
            };

            async run() {
              return {
                toJson() {
                  return {
                    mockTask2: 10,
                  };
                },
                toConsole() {
                  process.stdout.write('mock task2 is being run\n');
                },
              };
            }
          }
        );
      const anotherPlugin = new Plugin('another-plugin-mock')
        .addTask(
          class MockTask implements Task {
            taskName = 'mock-task3';
            friendlyTaskName = 'Mock Task3';
            taskClassification = {
              category: 0,
              priority: 0,
            };

            async run() {
              return {
                toJson() {
                  return {
                    mockTask: 15,
                  };
                },
                toConsole() {
                  process.stdout.write('mock task3 is being run\n');
                },
              };
            }
          }
        )
        .build();

      project = new CheckupProject('checkup-project', '0.0.0')
        .addCheckupConfig({
          plugins: ['@checkup/plugin-mock', 'another-plugin-mock'],
          tasks: {},
        })
        .addPlugin(plugin)
        .addPlugin(anotherPlugin);

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

    it('should use the config at the config path if provided', async () => {
      const anotherProject = new CheckupProject('another-project').addCheckupConfig({
        plugins: ['@checkup/plugin-mock'],
        tasks: {},
      });
      anotherProject.writeSync();
      await cmd.run(['--config', path.join(anotherProject.baseDir, '.checkuprc'), project.baseDir]);

      expect(stdout()).toMatchSnapshot();
      anotherProject.dispose();
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
