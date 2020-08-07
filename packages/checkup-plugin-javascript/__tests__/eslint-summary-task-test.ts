import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import {
  EslintSummaryTask,
  readEslintConfig,
  ACCEPTED_ESLINT_CONFIG_FILES,
} from '../src/tasks/eslint-summary-task';
import { evaluateActions } from '../src/actions/eslint-summary-actions';
import { PackageJson } from 'type-fest';
import { getPluginName, Task, TaskResult } from '@checkup/core';

describe('eslint-summary-task', () => {
  let project: CheckupProject;
  let pluginName = getPluginName(__dirname);
  let task: Task;
  let result: TaskResult;

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

    task = new EslintSummaryTask(
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
    );
    result = await task.run();
  });

  afterAll(() => {
    project.dispose();
  });

  it('it summarizes eslint and outputs to JSON', async () => {
    expect(result).toMatchSnapshot();
  });

  it('returns correct action items if there are too many warnings or errors', async () => {
    let actions = evaluateActions(result, task.config);

    expect(actions).toHaveLength(2);
    expect(actions).toMatchInlineSnapshot(`
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
