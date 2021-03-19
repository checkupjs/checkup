import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import CheckupTaskRunner from '../src/api/checkup-task-runner';
import { BaseTask, Task, TaskContext, sarifBuilder } from '@checkup/core';
import { Result } from 'sarif';

class FooTask extends BaseTask implements Task {
  taskName = 'foo';
  taskDisplayName = 'Foo Task';
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
    project = new CheckupProject('checkup-app', '0.0.0', (project) => {
      project.addDependency('react', '^15.0.0');
      project.addDependency('react-dom', '^15.0.0');
    });
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

    expect(await taskRunner.run()).toMatchObject({
      $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json',
      properties: {
        actions: [],
        analyzedFiles: expect.any(Array),
        analyzedFilesCount: 4,
        cli: {
          args: expect.any(Array),
          config: {
            $schema:
              'https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json',
            excludePaths: [],
            plugins: [],
            tasks: {},
          },
          configHash: expect.any(String),
          flags: {
            config: undefined,
            excludePaths: undefined,
            format: 'stdout',
            outputFile: '',
            tasks: undefined,
          },
          schema: 1,
          version: '0.0.0',
        },
        project: {
          name: 'checkup-app',
          repository: {
            activeDays: '0 days',
            age: '0 days',
            linesOfCode: {
              total: 2,
              types: expect.any(Array),
            },
            totalCommits: 0,
            totalFiles: 0,
          },
          version: '0.0.0',
        },
        timings: {},
      },
      runs: [
        {
          invocations: [
            {
              arguments: expect.any(Array),
              endTimeUtc: expect.any(String),
              environmentVariables: {
                cwd: expect.any(String),
                format: 'stdout',
                outputFile: '',
              },
              executionSuccessful: true,
              startTimeUtc: expect.any(String),
              toolExecutionNotifications: [],
            },
          ],
          results: [],
          tool: {
            driver: {
              informationUri: 'https://github.com/checkupjs/checkup',
              language: 'en-US',
              name: 'Checkup',
              rules: [],
              version: '0.0.0',
            },
          },
        },
      ],
      version: '2.1.0',
    });
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

    expect(await taskRunner.run()).toMatchObject({
      $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json',
      properties: {
        actions: [],
        analyzedFiles: expect.any(Array),
        analyzedFilesCount: expect.any(Number),
        cli: {
          args: expect.any(Array),
          config: {
            $schema:
              'https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json',
            excludePaths: [],
            plugins: [],
            tasks: {},
          },
          configHash: expect.any(String),
          flags: {
            config: undefined,
            excludePaths: undefined,
            format: 'stdout',
            outputFile: '',
            tasks: undefined,
          },
          schema: 1,
          version: '0.0.0',
        },
        project: {
          name: 'checkup-app',
          repository: {
            activeDays: '0 days',
            age: '0 days',
            linesOfCode: {
              total: 2,
              types: expect.any(Array),
            },
            totalCommits: 0,
            totalFiles: 0,
          },
          version: '0.0.0',
        },
        timings: {},
      },
      runs: [
        {
          invocations: [
            {
              arguments: expect.any(Array),
              endTimeUtc: expect.any(String),
              environmentVariables: {
                cwd: expect.any(String),
                format: 'stdout',
                outputFile: '',
              },
              executionSuccessful: true,
              startTimeUtc: expect.any(String),
              toolExecutionNotifications: [],
            },
          ],
          results: expect.any(Array),
          tool: {
            driver: {
              informationUri: 'https://github.com/checkupjs/checkup',
              language: 'en-US',
              name: 'Checkup',
              rules: expect.any(Array),
              version: '0.0.0',
            },
          },
        },
      ],
      version: '2.1.0',
    });
  });
});
