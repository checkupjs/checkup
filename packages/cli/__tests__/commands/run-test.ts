import { BaseTask, normalizePath, Task, TaskContext } from '@checkup/core';
import {
  CheckupProject,
  clearStdout,
  createTmpDir,
  getTaskContext,
  stdout,
} from '@checkup/test-helpers';
import * as fs from 'fs';
import { join } from 'path';
import { Log, Result } from 'sarif';
import { _registerTaskForTesting, _resetTasksForTesting } from '../../src/commands/run';
import { runCommand } from '../../src/run-command';

const TEST_TIMEOUT = 100000;

class FooTask extends BaseTask implements Task {
  taskName = 'foo';
  taskDisplayName = 'Foo Task';
  category = 'fake1';
  group = 'group1';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return [this.appendCheckupProperties({ message: { text: 'hi' }, occurrenceCount: 0 })];
  }
}

class FileCountTask extends BaseTask implements Task {
  taskName = 'file-count';
  taskDisplayName = 'File Count Task';
  category = 'fake2';
  group = 'group2';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return [this.appendCheckupProperties({ message: { text: 'hi' }, occurrenceCount: 0 })];
  }
}

describe('@checkup/cli', () => {
  describe('normal cli output', () => {
    let project: CheckupProject;

    beforeEach(function () {
      project = new CheckupProject('checkup-app', '0.0.0', (project) => {
        project.addDependency('react', '^15.0.0');
        project.addDependency('react-dom', '^15.0.0');
      });
      project.files['index.js'] = 'module.exports = {};';
      project.files['index.hbs'] = '<div>Checkup App</div>';

      project.addCheckupConfig({
        plugins: [],
        tasks: {},
      });
      project.writeSync();
      project.gitInit();
      project.install();
    });

    afterEach(function () {
      _resetTasksForTesting();
      project.dispose();
    });

    it(
      'should output checkup result',
      async () => {
        await runCommand(['run', '--cwd', project.baseDir]);

        let output = stdout().trim().split('\n');
        output[7] = '<outputPath>';

        expect(output).toEqual([
          'Checkup report generated for checkup-app v0.0.0 (6 files analyzed)',
          '',
          'This project is 0 days old, with 0 days active days, 0 commits and 0 files.',
          '',
          'Checkup ran the following task(s) successfully:',
          '',
          'Results have been saved to the following file:',
          '<outputPath>',
          '',
          'checkup v0.0.0',
          'config dd17cda1fc2eb2bc6bb5206b41fc1a84',
        ]);
      },
      TEST_TIMEOUT
    );

    it(
      'should output list of available tasks',
      async () => {
        _registerTaskForTesting(new FileCountTask(getTaskContext()));
        _registerTaskForTesting(new FooTask(getTaskContext()));

        await runCommand(['run', '--cwd', project.baseDir, '--listTasks']);

        expect(stdout()).toMatchSnapshot();
      },
      TEST_TIMEOUT
    );

    it(
      'should output checkup result in verbose mode',
      async () => {
        await runCommand(['run', '--cwd', project.baseDir, '--verbose']);

        expect(stdout()).toMatchSnapshot();
      },
      TEST_TIMEOUT
    );

    it('should output checkup result in JSON', async () => {
      await runCommand(['run', '--format', 'json', '--cwd', project.baseDir]);

      let output = JSON.parse(normalizePath(stdout().trim(), project.baseDir)) as Log;
      expect(output).toMatchSnapshot({
        runs: expect.any(Array),
      });
    });

    it(
      'should output a json file in a custom directory if the json format and outputFile options are provided',
      async () => {
        let tmp = createTmpDir();

        await runCommand([
          'run',
          '--format',
          'json',
          `--outputFile`,
          join(tmp, 'my-checkup-file.json'),
          '--cwd',
          project.baseDir,
        ]);

        let outputPath = stdout().trim();

        expect(outputPath).toMatch(/^(.*)\/my-checkup-file.json/);
        expect(fs.existsSync(outputPath)).toEqual(true);

        fs.unlinkSync(outputPath);
      },
      TEST_TIMEOUT
    );

    it('should run a single task if the tasks option is specified with a single task', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));

      await runCommand(['run', '--task', 'fake/file-count', '--cwd', project.baseDir, '--verbose']);

      expect(stdout()).toMatchSnapshot();
    });

    it('should run with timing if CHECKUP_TIMING=1', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));

      process.env.CHECKUP_TIMING = '1';
      await runCommand(['run', '--task', 'fake/file-count', '--cwd', project.baseDir, '--verbose']);

      expect(stdout()).toContain('Task Timings');
      process.env.CHECKUP_TIMING = undefined;
    });

    it('should run multiple tasks if the tasks option is specified with multiple tasks', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));
      _registerTaskForTesting(new FooTask(getTaskContext()));

      await runCommand([
        'run',
        '--task',
        'fake/file-count',
        '--task',
        'fake/foo',
        '--cwd',
        project.baseDir,
        '--verbose',
      ]);

      expect(stdout()).toMatchSnapshot();
    });

    it('should run only one task if the category option is specified', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));
      _registerTaskForTesting(new FooTask(getTaskContext()));

      await runCommand(['run', '--category', 'fake1', '--cwd', project.baseDir, '--verbose']);

      expect(stdout()).toMatchSnapshot();
    });

    it('should run multiple tasks if the category option is specified with multiple categories', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));
      _registerTaskForTesting(new FooTask(getTaskContext()));

      await runCommand([
        'run',
        '--category',
        'fake1',
        '--category',
        'fake2',
        '--cwd',
        project.baseDir,
        '--verbose',
      ]);

      expect(stdout()).toMatchSnapshot();
    });

    it('should run only one task if the group option is specified', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));
      _registerTaskForTesting(new FooTask(getTaskContext()));

      await runCommand(['run', '--group', 'group1', '--cwd', project.baseDir, '--verbose']);

      expect(stdout()).toMatchSnapshot();
    });

    it('should run multiple tasks if the group option is specified with multiple groups', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));
      _registerTaskForTesting(new FooTask(getTaskContext()));

      await runCommand([
        'run',
        '--group',
        'group1',
        '--group',
        'group2',
        '--cwd',
        project.baseDir,
        '--verbose',
      ]);

      expect(stdout()).toMatchSnapshot();
    });

    it(
      'should run a task if its passed in via command line, even if it is turned "off" in config',
      async () => {
        _registerTaskForTesting(new FileCountTask(getTaskContext()));

        project.addCheckupConfig({ tasks: { 'fake/file-count': 'off' } });
        project.writeSync();

        await runCommand([
          'run',
          '--task',
          'fake/file-count',
          '--cwd',
          project.baseDir,
          '--verbose',
        ]);

        expect(stdout()).toMatchSnapshot();
      },
      TEST_TIMEOUT
    );

    it('should use the config at the config path if provided', async () => {
      const anotherProject = new CheckupProject('another-project');

      anotherProject.addCheckupConfig();
      anotherProject.writeSync();

      await runCommand([
        'run',
        '--config',
        join(anotherProject.baseDir, '.checkuprc'),
        '--cwd',
        project.baseDir,
        '--verbose',
      ]);

      expect(stdout()).toMatchSnapshot();
      anotherProject.dispose();
    });

    it(
      'should run the tasks on the globs passed into checkup, if provided, instead of entire app',
      async () => {
        _registerTaskForTesting(new FileCountTask(getTaskContext()));

        project.files = Object.assign(project.files, {
          foo: {
            'index.hbs': '{{!-- i should todo: write code --}}',
          },
          bar: {
            'index.js': '// TODO: write better code',
          },
          baz: {
            'index.js': '// TODO: write better code',
          },
        });

        project.writeSync();
        await runCommand([
          'run',
          '**/*.hbs',
          '**baz/**',
          '--tasks',
          'file-count',
          '--cwd',
          project.baseDir,
          '--verbose',
        ]);
        let filteredRun = stdout();
        expect(filteredRun).toMatchSnapshot();

        clearStdout();

        await runCommand(['run', '--cwd', project.baseDir, '--verbose']);
        let unFilteredRun = stdout();
        expect(unFilteredRun).toMatchSnapshot();

        expect(filteredRun).not.toStrictEqual(unFilteredRun);
      },
      TEST_TIMEOUT
    );

    it(
      'should use the excludePaths provided by the config',
      async () => {
        project.addCheckupConfig({ excludePaths: ['**/*.hbs'] });
        project.writeSync();

        await runCommand(['run', '--cwd', project.baseDir, '--verbose']);
        let filteredRun = stdout();
        expect(filteredRun).toMatchSnapshot();

        clearStdout();

        project.addCheckupConfig({ excludePaths: [] });
        project.writeSync();

        await runCommand(['run', '--cwd', project.baseDir, '--verbose']);
        let unFilteredRun = stdout();
        expect(unFilteredRun).toMatchSnapshot();

        expect(filteredRun).not.toStrictEqual(unFilteredRun);

        project.dispose();
      },
      TEST_TIMEOUT
    );

    it(
      'should use the excludePaths provided by the command line',
      async () => {
        await runCommand([
          'run',
          '--cwd',
          project.baseDir,
          '--excludePaths',
          '**/*.hbs',
          '**/*.js',
          '--verbose',
        ]);

        let hbsJsFilteredRun = stdout();

        expect(hbsJsFilteredRun).toMatchSnapshot();

        clearStdout();

        await runCommand([
          'run',
          '--cwd',
          project.baseDir,
          '--excludePaths',
          '**/*.hbs',
          '--verbose',
        ]);

        let hbsFilteredRun = stdout();
        expect(hbsFilteredRun).toMatchSnapshot();

        expect(hbsJsFilteredRun).not.toStrictEqual(hbsFilteredRun);
      },
      TEST_TIMEOUT
    );

    it(
      'if excludePaths are provided by both the config and command line, use command line',
      async () => {
        project.addCheckupConfig({ excludePaths: ['**/*.hbs'] });
        project.writeSync();

        await runCommand([
          'run',
          '--cwd',
          project.baseDir,
          '--excludePaths',
          '**/*.js',
          '--verbose',
        ]);

        let jsFilteredRun = stdout();

        expect(jsFilteredRun).toMatchSnapshot();

        clearStdout();

        await runCommand(['run', '--cwd', project.baseDir, '--verbose']);

        let hbsFilteredRun = stdout();
        expect(hbsFilteredRun).toMatchSnapshot();

        expect(jsFilteredRun).not.toStrictEqual(hbsFilteredRun);
      },
      TEST_TIMEOUT
    );
  });
});
