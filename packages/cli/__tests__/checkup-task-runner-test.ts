import { CheckupProject } from '@checkup/test-helpers';
import CheckupTaskRunner from '../src/api/checkup-task-runner';

describe('checkup-task-runner', () => {
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

    expect(await taskRunner.run()).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json",
        "properties": Object {
          "actions": Array [],
          "analyzedFiles": FilePathArray [
            ".checkuprc",
            ".eslintrc.js",
            "index.hbs",
            "index.js",
            "package-lock.json",
            "package.json",
          ],
          "analyzedFilesCount": 6,
          "cli": Object {
            "args": Object {
              "paths": Array [
                "--cwd",
                "/private/var/folders/5m/4ybwhyvn3979lm2223q_q22c000gyd/T/tmp-91534l83ku0LeSAD1/checkup-app",
                "--format",
                "stdout",
                "--outputFile",
                "",
              ],
            },
            "config": Object {
              "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json",
              "excludePaths": Array [],
              "plugins": Array [],
              "tasks": Object {},
            },
            "configHash": "dd17cda1fc2eb2bc6bb5206b41fc1a84",
            "flags": Object {
              "config": undefined,
              "excludePaths": undefined,
              "format": "stdout",
              "outputFile": "",
              "tasks": undefined,
            },
            "schema": 1,
            "version": "0.0.0",
          },
          "project": Object {
            "name": "checkup-app",
            "repository": Object {
              "activeDays": "0 days",
              "age": "0 days",
              "linesOfCode": Object {
                "total": 3,
                "types": Array [
                  Object {
                    "extension": "js",
                    "total": 2,
                  },
                  Object {
                    "extension": "hbs",
                    "total": 1,
                  },
                ],
              },
              "totalCommits": 0,
              "totalFiles": 0,
            },
            "version": "0.0.0",
          },
          "timings": Object {},
        },
        "runs": Array [
          Object {
            "invocations": Array [
              Object {
                "arguments": Array [
                  "--cwd",
                  "/private/var/folders/5m/4ybwhyvn3979lm2223q_q22c000gyd/T/tmp-91534l83ku0LeSAD1/checkup-app",
                  "--format",
                  "stdout",
                  "--outputFile",
                  "",
                ],
                "endTimeUtc": "2021-03-16T18:26:07.499Z",
                "environmentVariables": Object {
                  "cwd": "/private/var/folders/5m/4ybwhyvn3979lm2223q_q22c000gyd/T/tmp-91534l83ku0LeSAD1/checkup-app",
                  "format": "stdout",
                  "outputFile": "",
                },
                "executionSuccessful": true,
                "startTimeUtc": "2021-03-16T18:26:07.308Z",
                "toolExecutionNotifications": Array [],
              },
            ],
            "results": Array [],
            "tool": Object {
              "driver": Object {
                "informationUri": "https://github.com/checkupjs/checkup",
                "language": "en-US",
                "name": "Checkup",
                "rules": Array [],
                "version": "0.0.0",
              },
            },
          },
        ],
        "version": "2.1.0",
      }
    `);
  });
});
