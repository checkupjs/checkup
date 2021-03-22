import { BaseTask, Task, TaskContext2, sarifBuilder } from '@checkup/core';
import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import type { Result } from 'sarif';
import CheckupTaskRunner from '../src/api/checkup-task-runner';
import { sarifLogMatcher } from './__utils__/sarif-match-object';

class FooTask extends BaseTask implements Task {
  taskName = 'foo';
  taskDisplayName = 'Foo Task';
  category = 'fake1';
  group = 'group1';

  constructor(context: TaskContext2) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return sarifBuilder.fromData(this, [], 'hi');
  }
}

class FileCountTask extends BaseTask implements Task {
  taskName = 'file-count';
  taskDisplayName = 'File Count Task';
  category = 'fake2';
  group = 'group2';

  constructor(context: TaskContext2) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return sarifBuilder.fromData(this, [], 'hi');
  }
}

describe('checkup-task-runner', () => {
  let project: CheckupProject;

  beforeEach(function () {
    project = new CheckupProject('checkup-app', '0.0.0', () => {});
    project.files['index.js'] = 'module.exports = {};';
    project.files['index.hbs'] = '<div>Checkup App</div>';

    project.writeSync();
    project.gitInit();
    project.install();
  });

  afterEach(function () {
    project.dispose();
  });

  it('can instantiate with options', () => {
    let taskRunner = new CheckupTaskRunner({
      paths: [],
      cwd: '.',
      format: 'stdout',
      outputFile: '',
    });

    expect(taskRunner.options).toEqual({
      paths: [],
      cwd: '.',
      format: 'stdout',
      outputFile: '',
    });
  });

  it('can return a default SARIF file when no plugins are loaded', async () => {
    let taskRunner = new CheckupTaskRunner({
      paths: [],
      cwd: project.baseDir,
      format: 'stdout',
      outputFile: '',
    });

    expect(await taskRunner.run()).toMatchObject(sarifLogMatcher);
  });

  it('can execute configured tasks', async () => {
    let taskRunner = new CheckupTaskRunner({
      paths: ['.'],
      cwd: project.baseDir,
      format: 'stdout',
      outputFile: '',
    });

    taskRunner.tasks.registerTask(new FileCountTask(getTaskContext()));
    taskRunner.tasks.registerTask(new FooTask(getTaskContext()));

    expect(await taskRunner.run()).toMatchObject(sarifLogMatcher);
  });
});
