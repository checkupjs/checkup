import * as assert from 'yeoman-assert';
import * as fs from 'fs';
import * as helpers from 'yeoman-test';
import * as path from 'path';

import { CheckupPluginProject } from '@checkup/test-helpers';
import TaskGenerator from '../../src/generators/task';

describe('task generator', () => {
  let project: CheckupPluginProject;

  beforeEach(function() {
    project = new CheckupPluginProject('@checkup/plugin-mock');
    project.writeSync();
  });

  afterEach(function() {
    //project.dispose();
  });

  it('defaults generates correct files with TypeScript', async () => {
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
    let taskIndexFile = path.join(dir, 'src/tasks/index.ts');
    let hooksFile = path.join(dir, 'src/hooks/register-tasks.ts');

    assert.file(taskFile);
    assert.file(taskResultsFile);
    assert.file(taskTestFile);

    let taskContents = fs.readFileSync(taskFile, 'utf-8');
    let taskResultsContents = fs.readFileSync(taskResultsFile, 'utf-8');
    let taskTestContents = fs.readFileSync(taskTestFile, 'utf-8');
    let taskIndexContents = fs.readFileSync(taskIndexFile, 'utf-8');
    let hooksFileContents = fs.readFileSync(hooksFile, 'utf-8');

    expect(taskContents).toMatchSnapshot();
    expect(taskResultsContents).toMatchSnapshot();
    expect(taskTestContents).toMatchSnapshot();
    expect(taskIndexContents).toMatchSnapshot();
    expect(hooksFileContents).toMatchSnapshot();
  });

  it('defaults generates multiple correct files with TypeScript', async () => {
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-foo',
        defaults: true,
      });

    dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-bar',
        defaults: true,
      });

    let fooTaskFile = path.join(dir, 'src/tasks/my-foo-task.ts');
    let fooTaskResultsFile = path.join(dir, 'src/results/my-foo-task-result.ts');
    let fooTaskTestFile = path.join(dir, '__tests__/my-foo-task-test.ts');
    let barTaskFile = path.join(dir, 'src/tasks/my-bar-task.ts');
    let barTaskResultsFile = path.join(dir, 'src/results/my-bar-task-result.ts');
    let barTaskTestFile = path.join(dir, '__tests__/my-bar-task-test.ts');
    let taskIndexFile = path.join(dir, 'src/tasks/index.ts');
    let hooksFile = path.join(dir, 'src/hooks/register-tasks.ts');

    assert.file(fooTaskFile);
    assert.file(fooTaskResultsFile);
    assert.file(fooTaskTestFile);
    assert.file(fooTaskFile);
    assert.file(fooTaskResultsFile);
    assert.file(fooTaskTestFile);

    let fooTaskContents = fs.readFileSync(fooTaskFile, 'utf-8');
    let fooTaskResultsContents = fs.readFileSync(fooTaskResultsFile, 'utf-8');
    let fooTaskTestContents = fs.readFileSync(fooTaskTestFile, 'utf-8');
    let barTaskContents = fs.readFileSync(barTaskFile, 'utf-8');
    let barTaskResultsContents = fs.readFileSync(barTaskResultsFile, 'utf-8');
    let barTaskTestContents = fs.readFileSync(barTaskTestFile, 'utf-8');
    let taskIndexContents = fs.readFileSync(taskIndexFile, 'utf-8');
    let hooksFileContents = fs.readFileSync(hooksFile, 'utf-8');

    expect(fooTaskContents).toMatchSnapshot();
    expect(fooTaskResultsContents).toMatchSnapshot();
    expect(fooTaskTestContents).toMatchSnapshot();
    expect(barTaskContents).toMatchSnapshot();
    expect(barTaskResultsContents).toMatchSnapshot();
    expect(barTaskTestContents).toMatchSnapshot();
    expect(taskIndexContents).toMatchSnapshot();
    expect(hooksFileContents).toMatchSnapshot();
  });

  it('generates correct files with JavaScript', async () => {
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-foo',
      })
      .withPrompts({
        typescript: false,
      });

    let taskFile = path.join(dir, 'src/tasks/my-foo-task.js');
    let taskResultsFile = path.join(dir, 'src/results/my-foo-task-result.js');
    let taskTestFile = path.join(dir, '__tests__/my-foo-task-test.js');
    let taskIndexFile = path.join(dir, 'src/tasks/index.js');
    let hooksFile = path.join(dir, 'src/hooks/register-tasks.js');

    assert.file(taskFile);
    assert.file(taskResultsFile);
    assert.file(taskTestFile);

    let taskContents = fs.readFileSync(taskFile, 'utf-8');
    let taskResultsContents = fs.readFileSync(taskResultsFile, 'utf-8');
    let taskTestContents = fs.readFileSync(taskTestFile, 'utf-8');
    let taskIndexContents = fs.readFileSync(taskIndexFile, 'utf-8');
    let hooksFileContents = fs.readFileSync(hooksFile, 'utf-8');

    expect(taskContents).toMatchSnapshot();
    expect(taskResultsContents).toMatchSnapshot();
    expect(taskTestContents).toMatchSnapshot();
    expect(taskIndexContents).toMatchSnapshot();
    expect(hooksFileContents).toMatchSnapshot();
  });

  it('generates correct files with category', async () => {
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-foo',
      })
      .withPrompts({
        category: 'Core',
      });

    let taskFile = path.join(dir, 'src/tasks/my-foo-task.ts');
    let taskResultsFile = path.join(dir, 'src/results/my-foo-task-result.ts');
    let taskTestFile = path.join(dir, '__tests__/my-foo-task-test.ts');
    let taskIndexFile = path.join(dir, 'src/tasks/index.ts');
    let hooksFile = path.join(dir, 'src/hooks/register-tasks.ts');

    assert.file(taskFile);
    assert.file(taskResultsFile);
    assert.file(taskTestFile);

    let taskContents = fs.readFileSync(taskFile, 'utf-8');
    let taskResultsContents = fs.readFileSync(taskResultsFile, 'utf-8');
    let taskTestContents = fs.readFileSync(taskTestFile, 'utf-8');
    let taskIndexContents = fs.readFileSync(taskIndexFile, 'utf-8');
    let hooksFileContents = fs.readFileSync(hooksFile, 'utf-8');

    expect(taskContents).toMatchSnapshot();
    expect(taskResultsContents).toMatchSnapshot();
    expect(taskTestContents).toMatchSnapshot();
    expect(taskIndexContents).toMatchSnapshot();
    expect(hooksFileContents).toMatchSnapshot();
  });

  it('generates correct files with priority', async () => {
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-foo',
      })
      .withPrompts({
        priority: 'High',
      });

    let taskFile = path.join(dir, 'src/tasks/my-foo-task.ts');
    let taskResultsFile = path.join(dir, 'src/results/my-foo-task-result.ts');
    let taskTestFile = path.join(dir, '__tests__/my-foo-task-test.ts');
    let taskIndexFile = path.join(dir, 'src/tasks/index.ts');
    let hooksFile = path.join(dir, 'src/hooks/register-tasks.ts');

    assert.file(taskFile);
    assert.file(taskResultsFile);
    assert.file(taskTestFile);

    let taskContents = fs.readFileSync(taskFile, 'utf-8');
    let taskResultsContents = fs.readFileSync(taskResultsFile, 'utf-8');
    let taskTestContents = fs.readFileSync(taskTestFile, 'utf-8');
    let taskIndexContents = fs.readFileSync(taskIndexFile, 'utf-8');
    let hooksFileContents = fs.readFileSync(hooksFile, 'utf-8');

    expect(taskContents).toMatchSnapshot();
    expect(taskResultsContents).toMatchSnapshot();
    expect(taskTestContents).toMatchSnapshot();
    expect(taskIndexContents).toMatchSnapshot();
    expect(hooksFileContents).toMatchSnapshot();
  });
});
