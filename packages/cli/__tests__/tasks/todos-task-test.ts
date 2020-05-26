import { CheckupProject, stdout, getTaskContext, clearFilePaths } from '@checkup/test-helpers';

import TodosTask from '../../src/tasks/todos-task';
import TodosTaskResult from '../../src/results/todos-task-result';

describe('todos-task', () => {
  let project: CheckupProject;

  beforeEach(function () {
    project = new CheckupProject('foo', '0.0.0');
    project.files['index.js'] = '// TODO: write better code';
    project.files['index.hbs'] = '{{!-- i should todo: write code --}}';
    project.writeSync();
  });

  afterEach(function () {
    project.dispose();
  });

  it('returns all the types found in the app and outputs to the console', async () => {
    const result = await new TodosTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
      })
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
      getTaskContext({
        paths: project.filePaths,
      })
    ).run();
    const typesTaskResult = <TodosTaskResult>result;

    const json = typesTaskResult.toJson();
    expect({ ...json, ...{ result: clearFilePaths(json.result.todos) } }).toMatchInlineSnapshot(`
      Object {
        "meta": Object {
          "friendlyTaskName": "Number of TODOs",
          "taskClassification": Object {
            "category": "insights",
            "priority": "low",
          },
          "taskName": "todos",
        },
        "result": Array [
          Object {
            "data": Array [],
            "displayName": "Todo",
            "total": 2,
            "type": "todo",
          },
        ],
      }
    `);
  });
});
