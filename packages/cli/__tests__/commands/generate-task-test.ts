import * as fs from 'fs';
import * as path from 'path';

import { Category, Priority, Task } from '@checkup/core';
import { CheckupProject, Plugin } from '@checkup/test-helpers';

import cmd = require('../../src');

describe('@checkup/cli generate task command', () => {
  describe('task generator', () => {
    let project: CheckupProject;

    beforeEach(function() {
      const plugin = new Plugin('@checkup/plugin-mock').addTask(
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
              pdf() {},
            };
          }
        }
      );

      project = new CheckupProject('checkup-project', '0.0.0')
        .addCheckupConfig({
          plugins: ['@checkup/plugin-mock', 'another-plugin-mock'],
          tasks: {},
        })
        .addPlugin(plugin);

      project.writeSync();
    });

    afterEach(function() {
      project.dispose();
    });

    it('with defaults generates correct files', async () => {
      await cmd.run(['generate', 'task', 'my-foo', project.baseDir, '--defaults']);

      let taskContents = fs.readFileSync(
        path.join(project.baseDir, 'src/tasks/my-foo-task.ts'),
        'utf-8'
      );
      let taskResultsContents = fs.readFileSync(
        path.join(project.baseDir, 'src/results/my-foo-task-result.ts'),
        'utf-8'
      );
      let taskTestContents = fs.readFileSync(
        path.join(project.baseDir, '__tests__/my-foo-task-test.ts'),
        'utf-8'
      );

      expect(taskContents).toMatchSnapshot();
      expect(taskResultsContents).toMatchSnapshot();
      expect(taskTestContents).toMatchSnapshot();
    });
  });
});
