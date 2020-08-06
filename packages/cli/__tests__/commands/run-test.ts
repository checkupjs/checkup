import { BaseTask, normalizePath, Task, TaskContext, TaskResult } from '@checkup/core';
import {
  CheckupProject,
  clearStdout,
  createTmpDir,
  getTaskContext,
  stdout,
} from '@checkup/test-helpers';
import * as fs from 'fs';
import { join } from 'path';
import { _registerTaskForTesting, _resetTasksForTesting } from '../../src/commands/run';
import { runCommand } from '../../src/run-command';
import { getMockTaskResult } from '../__utils__/mock-task-result';

const TEST_TIMEOUT = 100000;

class FooTask extends BaseTask implements Task {
  meta = {
    taskName: 'foo',
    friendlyTaskName: 'Foo Task',
    taskClassification: {
      category: 'fake',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return getMockTaskResult(this.meta, this.config, 'foo is being run');
  }
}

class FileCountTask extends BaseTask implements Task {
  meta = {
    taskName: 'file-count',
    friendlyTaskName: 'File Count Task',
    taskClassification: {
      category: 'fake',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return getMockTaskResult(this.meta, this.config, this.context.paths.length);
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
      project.dispose();
    });

    it(
      'should output checkup result',
      async () => {
        await runCommand(['run', '--cwd', project.baseDir]);

        expect(stdout()).toMatchSnapshot();
      },
      TEST_TIMEOUT
    );

    it('should output checkup result in JSON', async () => {
      await runCommand(['run', '--format', 'json', '--cwd', project.baseDir]);

      let output = normalizePath(stdout().trim(), project.baseDir);

      expect(output).toMatchSnapshot();
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

      await runCommand(['run', '--tasks', 'file-count', '--cwd', project.baseDir]);

      expect(stdout()).toMatchSnapshot();
      _resetTasksForTesting();
    });

    it('should run multiple tasks if the tasks option is specified with multiple tasks', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));
      _registerTaskForTesting(new FooTask(getTaskContext()));

      await runCommand(['run', '--tasks', 'file-count', 'foo', '--cwd', project.baseDir]);

      expect(stdout()).toMatchSnapshot();
      _resetTasksForTesting();
    });

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
        ]);
        let filteredRun = stdout();
        expect(filteredRun).toMatchSnapshot();

        clearStdout();

        await runCommand(['run', '--cwd', project.baseDir]);
        let unFilteredRun = stdout();
        expect(unFilteredRun).toMatchSnapshot();

        expect(filteredRun).not.toStrictEqual(unFilteredRun);
        _resetTasksForTesting();
      },
      TEST_TIMEOUT
    );

    it(
      'should use the excludePaths provided by the config',
      async () => {
        project.addCheckupConfig({ excludePaths: ['**/*.hbs'] });
        project.writeSync();

        await runCommand(['run', '--cwd', project.baseDir]);
        let filteredRun = stdout();
        expect(filteredRun).toMatchSnapshot();

        clearStdout();

        project.addCheckupConfig({ excludePaths: [] });
        project.writeSync();

        await runCommand(['run', '--cwd', project.baseDir]);
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
        ]);

        let hbsJsFilteredRun = stdout();

        expect(hbsJsFilteredRun).toMatchSnapshot();

        clearStdout();

        await runCommand(['run', '--cwd', project.baseDir, '--excludePaths', '**/*.hbs']);

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

        await runCommand(['run', '--cwd', project.baseDir, '--excludePaths', '**/*.js']);

        let jsFilteredRun = stdout();

        expect(jsFilteredRun).toMatchSnapshot();

        clearStdout();

        await runCommand(['run', '--cwd', project.baseDir]);

        let hbsFilteredRun = stdout();
        expect(hbsFilteredRun).toMatchSnapshot();

        expect(jsFilteredRun).not.toStrictEqual(hbsFilteredRun);
      },
      TEST_TIMEOUT
    );
  });
});
