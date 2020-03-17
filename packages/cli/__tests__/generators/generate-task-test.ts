import * as assert from 'yeoman-assert';
import * as fs from 'fs';
import * as helpers from 'yeoman-test';
import * as path from 'path';

import { Category, Priority, Task } from '@checkup/core';
import { CheckupProject, Plugin } from '@checkup/test-helpers';

import TaskGenerator from '../../src/generators/task';

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
      .addPlugin(plugin);

    project.writeSync();
  });

  afterEach(function() {
    project.dispose();
  });

  it('with defaults generates correct files', async () => {
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-foo',
        defaults: true,
      });

    let taskFile = path.join(dir, 'src/tasks/my-foo-task.ts');
    let taskResultsFile = path.join(dir, 'src/results/my-foo-task-result.ts');
    let taskTestFile = path.join(dir, '__tests__/my-foo-task-test.ts');

    assert.file(taskFile);
    assert.file(taskResultsFile);
    assert.file(taskTestFile);

    let taskContents = fs.readFileSync(taskFile, 'utf-8');
    let taskResultsContents = fs.readFileSync(taskResultsFile, 'utf-8');
    let taskTestContents = fs.readFileSync(taskTestFile, 'utf-8');

    expect(taskContents).toMatchSnapshot();
    expect(taskResultsContents).toMatchSnapshot();
    expect(taskTestContents).toMatchSnapshot();
  });
});
