import { getPluginName } from '@checkup/core';
import { CheckupProject, getTaskContext } from '@checkup/test-helpers';

import EslintDisableTask from '../src/tasks/eslint-disable-task';
import { evaluateActions } from '../src/actions/eslint-disable-actions';

describe('eslint-disable-task', () => {
  let project: CheckupProject;
  let pluginName = getPluginName(__dirname);

  beforeEach(function () {
    project = new CheckupProject('foo', '0.0.0');
    project.files['index.js'] = `
    // eslint-disable-line no-eval
    /* eslint-disable */

    function foo(obj) { // adding this here because without babel parser, recast fails on this
      return {     // eslint-disable-line
        ...obj
      }
    }
    `;

    project.writeSync();
  });

  afterEach(function () {
    project.dispose();
  });

  it('returns all the types found in the app and outputs to json', async () => {
    const result = await new EslintDisableTask(
      pluginName,
      getTaskContext({
        paths: project.filePaths,
        cliFlags: { cwd: project.baseDir },
      })
    ).run();

    expect(result).toMatchInlineSnapshot(`
      Object {
        "info": Object {
          "category": "linting",
          "group": undefined,
          "taskDisplayName": "Number of eslint-disable Usages",
          "taskName": "eslint-disables",
        },
        "result": Array [
          Object {
            "count": 3,
            "data": Array [
              Object {
                "column": 4,
                "filePath": "/index.js",
                "line": 2,
                "message": "eslint-disable is not allowed",
                "ruleId": "no-eslint-disable",
              },
              Object {
                "column": 4,
                "filePath": "/index.js",
                "line": 3,
                "message": "eslint-disable is not allowed",
                "ruleId": "no-eslint-disable",
              },
              Object {
                "column": 19,
                "filePath": "/index.js",
                "line": 6,
                "message": "eslint-disable is not allowed",
                "ruleId": "no-eslint-disable",
              },
            ],
            "key": "eslint-disable",
            "type": "summary",
          },
        ],
      }
    `);
  });

  it('returns actions if there are more than 2 instances of eslint-disable', async () => {
    const task = new EslintDisableTask(
      pluginName,
      getTaskContext({
        paths: project.filePaths,
        cliFlags: { cwd: project.baseDir },
      })
    );
    const result = await task.run();

    let actions = evaluateActions(result, task.config);

    expect(actions).toHaveLength(1);
    expect(actions![0]).toMatchInlineSnapshot(`
      Object {
        "defaultThreshold": 2,
        "details": "3 usages of template-lint-disable",
        "input": 3,
        "items": Array [
          "Total eslint-disable usages: 3",
        ],
        "name": "reduce-eslint-disable-usages",
        "summary": "Reduce number of eslint-disable usages",
      }
    `);
  });
});
