import '@microsoft/jest-sarif';
import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import { getPluginName, Task, FilePathArray } from '@checkup/core';
import { Result, Location } from 'sarif';
import { evaluateActions } from '../src/actions/eslint-summary-actions';
import EslintSummaryTask from '../src/tasks/eslint-summary-task.js';

describe('eslint-summary-task', () => {
  let project: CheckupProject;
  let pluginName = getPluginName(import.meta.url);
  let task: Task;
  let results: Result[];

  beforeAll(async () => {
    project = new CheckupProject('checkup-app', '0.0.0');
    project.files['included-path.js'] = `function foo() {
        var whatever = 'ESLint'
        return {
          name: whatever
        };
      }`;
    project.files['included-path.gts'] = `function foo() {
        var whatever = 'ESLint'
        return {
          name: whatever
        };
      }`;
    project.files['included-path.ts'] = `function foo() {
        var whatever = 'ESLint'
        return {
          name: whatever
        };
      }`;
    project.files['included-path.gts'] = `function foo() {
        var whatever = 'ESLint'
        return {
          name: whatever
        };
      }`;
    project.files['excluded-path.js'] = `function shmoo() {
        var whatever = 'ESLint'
        return {
          name: whatever
        };
      }`;
    project.files['.eslintrc.js'] = `module.exports = {
        rules: {
            semi: 'error',
            'no-var': 'warn'
        }
      };`;
    project.writeSync();
    project.gitInit();
    project.install();

    task = new EslintSummaryTask(
      pluginName,
      getTaskContext({
        options: { cwd: project.baseDir },
        pkg: project.pkg,
        paths: project.filePaths.filter((path) => path.includes('included-path')) as FilePathArray,
        config: {
          tasks: {
            'javascript/eslint-summary': [
              'on',
              {
                actions: {
                  'reduce-eslint-errors': ['on', { threshold: 0 }],
                  'reduce-eslint-warnings': ['on', { threshold: 0 }],
                },
              },
            ],
          },
        },
      })
    );

    results = await task.run();
  });

  afterAll(() => {
    project.dispose();
  });

  it('summarizes eslint and outputs to JSON', async () => {
    for (let result of results) {
      expect(result).toBeValidSarifFor('result');
    }
  });

  it('only lints the files passed in via paths array', async () => {
    let excludedPathsResults = results.filter(
      (resultData: Result) =>
        (
          resultData.locations?.filter((fileLocation: Location) => {
            return fileLocation?.physicalLocation?.artifactLocation?.uri?.includes('excluded-path');
          }) || []
        ).length > 0
    );

    let includedPathsResults = results.filter(
      (resultData: Result) =>
        (
          resultData.locations?.filter((fileLocation: Location) => {
            return fileLocation?.physicalLocation?.artifactLocation?.uri?.includes('included-path');
          }) || []
        ).length > 0
    );

    expect(excludedPathsResults).toHaveLength(0);
    expect(includedPathsResults).toHaveLength(6);
  });

  it('returns correct action items if there are too many warnings or errors', async () => {
    let actions = evaluateActions(results, task.config);

    expect(actions).toHaveLength(2);
    expect(actions).toMatchInlineSnapshot(`
[
  {
    "defaultThreshold": 20,
    "details": "3 total errors",
    "input": 3,
    "items": [
      "Total eslint errors: 3",
    ],
    "name": "reduce-eslint-errors",
    "summary": "Reduce number of eslint errors",
    "taskName": "eslint-summary",
  },
  {
    "defaultThreshold": 20,
    "details": "3 total warnings",
    "input": 3,
    "items": [
      "Total eslint warnings: 3",
    ],
    "name": "reduce-eslint-warnings",
    "summary": "Reduce number of eslint warnings",
    "taskName": "eslint-summary",
  },
]
`);
  });
});
