import { CheckupProject, stdout, getTaskContext, isActionEnabled } from '@checkup/test-helpers';
import { ESLintReport } from '@checkup/core';
import {
  EslintSummaryTask,
  readEslintConfig,
  ACCEPTED_ESLINT_CONFIG_FILES,
} from '../src/tasks/eslint-summary-task';
import EslintSummaryTaskResult from '../src/results/eslint-summary-task-result';
import { PackageJson } from 'type-fest';
import { getPluginName, getShorthandName } from '@checkup/core';

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
            [`${getShorthandName(pluginName)}/eslint-summary`]: {
              actions: {
                'num-eslint-errors': { threshold: 0 },
                'num-eslint-warnings': { threshold: 0 },
              },
            },
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

      Rule name Failures             
      semi      1 errors (1 fixable) 

      Warnings

      Rule name Failures               
      no-var    1 warnings (1 fixable) 

      "
    `);
  });

  it('it summarizes eslint and outputs to JSON', async () => {
    expect(filterResultFilePath(taskResult.toJson().result.esLintReport)).toMatchSnapshot();
  });

  it('returns correct action items if there are too many warnings or errors', async () => {
    expect(isActionEnabled(taskResult.actionList.enabledActions, 'num-eslint-errors')).toEqual(
      true
    );
    expect(isActionEnabled(taskResult.actionList.enabledActions, 'num-eslint-warnings')).toEqual(
      true
    );

    expect(taskResult.actionList.actionMessages).toMatchInlineSnapshot(`
      Array [
        "There are 1 eslint errors, there should be at most 0.",
        "There are 1 eslint warnings, there should be at most 0.",
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

function filterResultFilePath(report: ESLintReport) {
  let filteredResults = report.results.map((result) => {
    result.filePath = '';
  });
  return { ...{ results: filteredResults }, ...report };
}
