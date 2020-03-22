/* eslint-disable jest/expect-expect */

import * as assert from 'yeoman-assert';
import * as fs from 'fs';
import * as helpers from 'yeoman-test';
import * as path from 'path';

import { CheckupPluginProject } from '@checkup/test-helpers';
import TaskGenerator from '../../src/generators/task';

function assertTaskFiles(name: string, dir: string, extension: string = 'ts') {
  let taskFile = path.join(dir, `src/tasks/${name}-task.${extension}`);
  let taskResultsFile = path.join(dir, `src/results/${name}-task-result.${extension}`);
  let taskTestFile = path.join(dir, `__tests__/${name}-task-test.${extension}`);

  assert.file(taskFile);
  assert.file(taskResultsFile);
  assert.file(taskTestFile);

  let taskContents = fs.readFileSync(taskFile, 'utf-8');
  let taskResultsContents = fs.readFileSync(taskResultsFile, 'utf-8');
  let taskTestContents = fs.readFileSync(taskTestFile, 'utf-8');

  expect(taskContents).toMatchSnapshot();
  expect(taskResultsContents).toMatchSnapshot();
  expect(taskTestContents).toMatchSnapshot();
}

function assertPluginFiles(dir: string, extension: string = 'ts') {
  let taskIndexFile = path.join(dir, `src/tasks/index.${extension}`);
  let hooksFile = path.join(dir, `src/hooks/register-tasks.${extension}`);

  let taskIndexContents = fs.readFileSync(taskIndexFile, 'utf-8');
  let hooksFileContents = fs.readFileSync(hooksFile, 'utf-8');

  expect(taskIndexContents).toMatchSnapshot();
  expect(hooksFileContents).toMatchSnapshot();
}

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

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
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

    assertTaskFiles('my-foo', dir);
    assertTaskFiles('my-bar', dir);
    assertPluginFiles(dir);
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

    assertTaskFiles('my-foo', dir, 'js');
    assertPluginFiles(dir, 'js');
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

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
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

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
  });
});
