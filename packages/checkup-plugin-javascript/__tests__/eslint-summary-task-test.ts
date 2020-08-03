import { CheckupProject, stdout, getTaskContext } from '@checkup/test-helpers';
import {
  EslintSummaryTask,
  readEslintConfig,
  ACCEPTED_ESLINT_CONFIG_FILES,
} from '../src/tasks/eslint-summary-task';
import EslintSummaryTaskResult from '../src/results/eslint-summary-task-result';
import { PackageJson } from 'type-fest';
import { getPluginName } from '@checkup/core';

describe('eslint-summary-task', () => {
  let project: CheckupProject;
  let pluginName = getPluginName(__dirname);
  let taskResult: EslintSummaryTaskResult;

  beforeAll(async () => {
    project = new CheckupProject('checkup-app', '0.0.0');
    project.files['foo.js'] = `function foo() {
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

    let result = await new EslintSummaryTask(
      pluginName,
      getTaskContext({
        cliFlags: { cwd: project.baseDir },
        pkg: project.pkg,
        paths: project.filePaths,
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
    ).run();
    taskResult = <EslintSummaryTaskResult>result;
  });

  afterAll(() => {
    project.dispose();
  });

  it('it summarizes eslint and outputs to console', async () => {
    taskResult.toConsole();

    expect(stdout()).toMatchInlineSnapshot(`
      "Eslint Summary

      Error count: 1
      Warning count: 1

      Errors

      Rule name Errors
      semi      1

      Warnings

      Rule name Errors
      no-var    1

      "
    `);
  });

  it('it summarizes eslint and outputs to JSON', async () => {
    expect(taskResult.toJson()).toMatchSnapshot();
  });

  it('returns correct action items if there are too many warnings or errors', async () => {
    expect(taskResult.actions).toHaveLength(2);
    expect(taskResult.actions).toMatchInlineSnapshot(`
      Array [
        Object {
          "defaultThreshold": 20,
          "details": "1 total errors",
          "input": 1,
          "items": Array [
            "Total eslint errors: 1",
          ],
          "name": "reduce-eslint-errors",
          "summary": "Reduce number of eslint errors",
        },
        Object {
          "defaultThreshold": 20,
          "details": "1 total warnings",
          "input": 1,
          "items": Array [
            "Total eslint warnings: 1",
          ],
          "name": "reduce-eslint-warnings",
          "summary": "Reduce number of eslint warnings",
        },
      ]
    `);
  });
});

describe('readEslintConfig', () => {
  const eslintConfigJson = 'airbnb';
  const pkg: PackageJson = {
    name: 'foo-project',
    version: '0.0.0',
    keywords: [],
    eslintConfig: eslintConfigJson,
  };

  ACCEPTED_ESLINT_CONFIG_FILES.forEach((file) => {
    it(`it returns ${file}, even if there is also a JSON config (as .eslintrc* are prioritized over config in package.json)`, () => {
      let expectedConfig = 'foo';

      let project = new CheckupProject('foo-project');
      project.files[file] = expectedConfig;
      project.writeSync();

      const eslintConfig = readEslintConfig(project.filePaths, project.baseDir, pkg);

      expect(eslintConfig).toEqual(expectedConfig);
      project.dispose();
    });
  });

  it('it reads config from package.json, only if there is no .eslintrc*', () => {
    const eslintConfig = readEslintConfig([], '.', pkg);

    expect(eslintConfig).toEqual(eslintConfigJson);
  });

  it('it reads the higher prioritzed .eslintrc*', () => {
    let expectedConfig = 'foo';

    let project = new CheckupProject('foo-project');
    project.files['.eslintrc.js'] = expectedConfig;
    project.files['.eslintrc.json'] = 'blue';
    project.writeSync();

    const eslintConfig = readEslintConfig(project.filePaths, project.baseDir, pkg);

    expect(eslintConfig).toEqual(expectedConfig);
    project.dispose();
  });
});
