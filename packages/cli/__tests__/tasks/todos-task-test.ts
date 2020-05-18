import { stdout, getTaskContext } from '@checkup/test-helpers';

import TodosTask from '../../src/tasks/todos-task';
import TodosTaskResult from '../../src/results/todos-task-result';
import Project = require('fixturify-project');

describe('todos-task', () => {
  let project: Project;

  beforeEach(function () {
    project = new Project('foo', '0.0.0');
    project.files['index.js'] = '// TODO: write better code';
    project.files['index.hbs'] = '{{!-- i should TODO: write code --}}';
    project.writeSync();
  });

  afterEach(function () {
    project.dispose();
  });

  it('returns all the types found in the app and outputs to the console', async () => {
    const result = await new TodosTask(
      'internal',
      getTaskContext({}, { cwd: project.baseDir })
    ).run();
    const typesTaskResult = <TodosTaskResult>result;

    typesTaskResult.toConsole();

    expect(stdout()).toMatchInlineSnapshot(`
      "=== Number of TODOs ===

      TODOs found: 2

      "
    `);
  });

  it('returns all the types found in the app and outputs to json', async () => {
    const result = await new TodosTask(
      'internal',
      getTaskContext({}, { cwd: project.baseDir })
    ).run();
    const typesTaskResult = <TodosTaskResult>result;

    const json = typesTaskResult.toJson();

    expect(json).toMatchInlineSnapshot(`
      Object {
        "todos": 2,
      }
    `);
  });

  it('returns all the types found in the app and outputs toReportData', async () => {
    const result = await new TodosTask(
      'internal',
      getTaskContext({}, { cwd: project.baseDir })
    ).run();
    const typesTaskResult = <TodosTaskResult>result;

    const reportData = typesTaskResult.toReportData();

    expect(reportData).toMatchInlineSnapshot(`
      Array [
        NumericalCardData {
          "componentType": "numerical-card",
          "grade": "A",
          "meta": Object {
            "friendlyTaskName": "Number of TODOs",
            "taskClassification": Object {
              "category": "insights",
              "priority": "low",
            },
            "taskName": "todos",
          },
          "resultData": 2,
          "resultDescription": "TODOs found",
          "resultHelp": undefined,
        },
      ]
    `);
  });
});
