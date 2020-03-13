import * as fs from 'fs';
import * as path from 'path';

import { Category, CheckupConfig, Priority, Task } from '@checkup/core';
import { CheckupProject, Plugin, createTmpDir, stdout } from '@checkup/test-helpers';

import cmd = require('../src');

const TEST_TIMEOUT = 30000;

describe('@checkup/cli', () => {
  describe('normal cli output with plugins', () => {
    let project: CheckupProject;

    beforeEach(function() {
      const plugin = new Plugin('@checkup/plugin-mock')
        .addTask(
          class MockTask implements Task {
            meta = {
              taskName: 'mock-task',
              friendlyTaskName: 'Mock Task',
              taskClassification: {
                category: Category.Core,
                priority: Priority.High,
              },
            };

            async run() {
              return {
                json() {
                  return {
                    meta: {
                      taskName: 'mock-task',
                      friendlyTaskName: 'Mock Task',
                      taskClassification: {
                        category: Category.Core,
                        priority: Priority.High,
                      },
                    },
                    result: {
                      mockTask1: 5,
                    },
                  };
                },
                stdout() {
                  process.stdout.write('mock task is being run\n');
                },
                pdf() {
                  return undefined;
                },
              };
            }
          }
        )
        .addTask(
          class MockTask2 implements Task {
            meta = {
              taskName: 'mock-task2',
              friendlyTaskName: 'Mock Task 2',
              taskClassification: {
                category: Category.Core,
                priority: Priority.High,
              },
            };

            async run() {
              return {
                json() {
                  return {
                    meta: {
                      taskName: 'mock-task2',
                      friendlyTaskName: 'Mock Task 2',
                      taskClassification: {
                        category: Category.Core,
                        priority: Priority.High,
                      },
                    },
                    result: {
                      mockTask2: 10,
                    },
                  };
                },
                stdout() {
                  process.stdout.write('mock task2 is being run\n');
                },
                pdf() {
                  return undefined;
                },
              };
            }
          }
        );
      const anotherPlugin = new Plugin('another-plugin-mock').addTask(
        class MockTask implements Task {
          meta = {
            taskName: 'mock-task3',
            friendlyTaskName: 'Mock Task3',
            taskClassification: {
              category: Category.Core,
              priority: Priority.High,
            },
          };

          async run() {
            return {
              json() {
                return {
                  meta: {
                    taskName: 'mock-task3',
                    friendlyTaskName: 'Mock Task 3',
                    taskClassification: {
                      category: Category.Core,
                      priority: Priority.High,
                    },
                  },
                  result: {
                    mockTask2: 10,
                  },
                };
              },
              stdout() {
                process.stdout.write('mock task3 is being run\n');
              },
              pdf() {
                return undefined;
              },
            };
          }
        }
      );

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

    it(
      'should output checkup result',
      async () => {
        await cmd.run(['run', project.baseDir]);

        expect(stdout()).toMatchSnapshot();
      },
      increasedTestTimeout
    );

    it('should output checkup result in JSON', async () => {
      await cmd.run(['run', '--reporter', 'json', project.baseDir]);

      expect(stdout()).toMatchSnapshot();
    });

    it(
      'should output a PDF in the current directory if the pdf reporter option is provided',
      async () => {
        await cmd.run(['run', '--reporter', 'pdf', project.baseDir]);

        let outputPath = stdout().trim();

        expect(outputPath).toMatch(
          /^(.*)\/checkup-report-(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})\.pdf/
        );
        expect(fs.existsSync(outputPath)).toEqual(true);

        fs.unlinkSync(outputPath);
      },
      increasedTestTimeout
    );

    it(
      'should output a PDF in a custom directory if the pdf reporter and reporterOutputPath options are provided',
      async () => {
        let tmp = createTmpDir();

        await cmd.run(['run', '--reporter', 'pdf', `--reportOutputPath`, tmp, project.baseDir]);

        let outputPath = stdout().trim();

        expect(outputPath).toMatch(
          /^(.*)\/checkup-report-(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})\.pdf/
        );
        expect(fs.existsSync(outputPath)).toEqual(true);

        fs.unlinkSync(outputPath);
      },
      increasedTestTimeout
    );

    it('should run a single task if the task option is specified', async () => {
      await cmd.run(['run', '--task', 'mock-task', project.baseDir]);

      expect(stdout()).toMatchSnapshot();
    });

    it('should use the config at the config path if provided', async () => {
      const anotherProject = new CheckupProject('another-project').addCheckupConfig({
        plugins: ['@checkup/plugin-mock'],
        tasks: {},
      });
      anotherProject.writeSync();
      await cmd.run([
        'run',
        '--config',
        path.join(anotherProject.baseDir, '.checkuprc'),
        project.baseDir,
      ]);

      expect(stdout()).toMatchSnapshot();
      anotherProject.dispose();
    });
  });

  describe('cli error cases', () => {
    it('should error if no checkup config is present', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0');
      project.writeSync();

      await expect(cmd.run(['run', project.baseDir])).rejects.toThrowErrorMatchingInlineSnapshot(
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

      await expect(cmd.run(['run', project.baseDir])).rejects.toThrowErrorMatchingInlineSnapshot(
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

      await expect(cmd.run(['run', project.baseDir])).rejects.toThrowErrorMatchingSnapshot();

      project.dispose();
    });
  });
});
