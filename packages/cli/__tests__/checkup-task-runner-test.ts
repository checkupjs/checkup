import {
  BaseTask,
  Task,
  TaskContext,
  sarifBuilder,
  DEFAULT_CONFIG,
  CheckupConfig,
} from '@checkup/core';
import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import type { Result } from 'sarif';
import CheckupTaskRunner from '../src/api/checkup-task-runner';

class FooTask extends BaseTask implements Task {
  taskName = 'foo';
  taskDisplayName = 'Foo Task';
  description = 'description';
  category = 'fake1';
  group = 'group1';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return sarifBuilder.fromData(this, [], 'hi');
  }
}

class FileCountTask extends BaseTask implements Task {
  taskName = 'file-count';
  taskDisplayName = 'File Count Task';
  description = 'description';
  category = 'fake2';
  group = 'group2';

  constructor(context: TaskContext) {
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
      cwd: '.',
    });

    expect(taskRunner.options).toEqual({
      cwd: '.',
    });
  });

  it('can return a default SARIF file when no plugins are loaded', async () => {
    let taskRunner = new CheckupTaskRunner({
      cwd: project.baseDir,
    });

    expect(await taskRunner.run()).toBeValidSarifLog();
  });

  it('can execute configured tasks', async () => {
    let taskRunner = new CheckupTaskRunner({
      cwd: project.baseDir,
    });

    taskRunner.tasks.registerTask(new FileCountTask(getTaskContext()));
    taskRunner.tasks.registerTask(new FooTask(getTaskContext()));

    expect(await taskRunner.run()).toBeValidSarifLog();
  });

  it('can use a config that is passed in inline', async () => {
    let config: CheckupConfig = DEFAULT_CONFIG;
    let excludedExtension = 'hbs';
    config.excludePaths = [`**/*.${excludedExtension}`];

    let taskRunner = new CheckupTaskRunner({
      paths: ['.'],
      cwd: project.baseDir,
      config,
    });

    taskRunner.tasks.registerTask(new FileCountTask(getTaskContext()));
    taskRunner.tasks.registerTask(new FooTask(getTaskContext()));

    let results = await taskRunner.run();
    let excludedPathResults = results.properties?.analyzedFiles.filter(
      (file: string) => file.split('.')[1] === excludedExtension
    );

    expect(excludedPathResults).toHaveLength(0);
  });
});
