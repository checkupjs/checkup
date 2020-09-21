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
  category = 'fake';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return [this.toJson({ message: { text: 'hi' }, occurrenceCount: 0 })];
  }
}

class FileCountTask extends BaseTask implements Task {
  taskName = 'file-count';
  taskDisplayName = 'File Count Task';
  category = 'fake';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return [this.toJson({ message: { text: 'hi' }, occurrenceCount: 0 })];
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
        await runCommand(['run', '--cwd', project.baseDir], { testing: true });

        expect(stdout()).toMatchSnapshot();
      },
      TEST_TIMEOUT
    );

    it('should output checkup result in JSON', async () => {
      await runCommand(['run', '--format', 'json', '--cwd', project.baseDir], { testing: true });

      let output = JSON.parse(normalizePath(stdout().trim(), project.baseDir)) as Log;
      expect(stripUtcTimes(output)).toMatchSnapshot();
    });

    it(
      'should output a json file in a custom directory if the json format and outputFile options are provided',
      async () => {
        let tmp = createTmpDir();

        await runCommand(
          [
            'run',
            '--format',
            'json',
            `--outputFile`,
            join(tmp, 'my-checkup-file.json'),
            '--cwd',
            project.baseDir,
          ],
          { testing: true }
        );

        let outputPath = stdout().trim();

        expect(outputPath).toMatch(/^(.*)\/my-checkup-file.json/);
        expect(fs.existsSync(outputPath)).toEqual(true);

        fs.unlinkSync(outputPath);
      },
      TEST_TIMEOUT
    );

    it('should run a single task if the tasks option is specified with a single task', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));

      await runCommand(['run', '--task', 'fake/file-count', '--cwd', project.baseDir], {
        testing: true,
      });

      expect(stdout()).toMatchSnapshot();
      _resetTasksForTesting();
    });

    it('should run with timing if CHECKUP_TIMING=1', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));

      process.env.CHECKUP_TIMING = '1';
      await runCommand(['run', '--task', 'fake/file-count', '--cwd', project.baseDir], {
        testing: true,
      });

      expect(stdout()).toContain('Task Timings');
      process.env.CHECKUP_TIMING = undefined;
      _resetTasksForTesting();
    });

    it('should run multiple tasks if the tasks option is specified with multiple tasks', async () => {
      _registerTaskForTesting(new FileCountTask(getTaskContext()));
      _registerTaskForTesting(new FooTask(getTaskContext()));

      await runCommand(
        ['run', '--task', 'fake/file-count', '--task', 'fake/foo', '--cwd', project.baseDir],
        { testing: true }
      );

      expect(stdout()).toMatchSnapshot();
      _resetTasksForTesting();
    });

    it(
      'should run a task if its passed in via command line, even if it is turned "off" in config',
      async () => {
        _registerTaskForTesting(new FileCountTask(getTaskContext()));

        project.addCheckupConfig({ tasks: { 'fake/file-count': 'off' } });
        project.writeSync();

        await runCommand(['run', '--task', 'fake/file-count', '--cwd', project.baseDir], {
          testing: true,
        });

        expect(stdout()).toMatchSnapshot();
        project.dispose();
        _resetTasksForTesting();
      },
      TEST_TIMEOUT
    );

    it('should use the config at the config path if provided', async () => {
      const anotherProject = new CheckupProject('another-project');

      anotherProject.addCheckupConfig();
      anotherProject.writeSync();

      await runCommand(
        ['run', '--config', join(anotherProject.baseDir, '.checkuprc'), '--cwd', project.baseDir],
        { testing: true }
      );

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
        await runCommand(
          ['run', '**/*.hbs', '**baz/**', '--tasks', 'file-count', '--cwd', project.baseDir],
          { testing: true }
        );
        let filteredRun = stdout();
        expect(filteredRun).toMatchSnapshot();

        clearStdout();

        await runCommand(['run', '--cwd', project.baseDir], { testing: true });
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

        await runCommand(['run', '--cwd', project.baseDir], { testing: true });
        let filteredRun = stdout();
        expect(filteredRun).toMatchSnapshot();

        clearStdout();

        project.addCheckupConfig({ excludePaths: [] });
        project.writeSync();

        await runCommand(['run', '--cwd', project.baseDir], { testing: true });
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
        await runCommand(
          ['run', '--cwd', project.baseDir, '--excludePaths', '**/*.hbs', '**/*.js'],
          { testing: true }
        );

        let hbsJsFilteredRun = stdout();

        expect(hbsJsFilteredRun).toMatchSnapshot();

        clearStdout();

        await runCommand(['run', '--cwd', project.baseDir, '--excludePaths', '**/*.hbs'], {
          testing: true,
        });

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

        await runCommand(['run', '--cwd', project.baseDir, '--excludePaths', '**/*.js'], {
          testing: true,
        });

        let jsFilteredRun = stdout();

        expect(jsFilteredRun).toMatchSnapshot();

        clearStdout();

        await runCommand(['run', '--cwd', project.baseDir], { testing: true });

        let hbsFilteredRun = stdout();
        expect(hbsFilteredRun).toMatchSnapshot();

        expect(jsFilteredRun).not.toStrictEqual(hbsFilteredRun);
      },
      TEST_TIMEOUT
    );
  });
});

function stripUtcTimes(output: Log) {
  return output.runs.map((run) => {
    return run.invocations?.map((invocation) => {
      invocation.endTimeUtc = '';
      invocation.startTimeUtc = '';
      return invocation;
    });
  });
}
