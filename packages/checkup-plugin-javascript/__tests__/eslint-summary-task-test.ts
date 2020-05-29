import { CheckupProject, stdout, getTaskContext } from '@checkup/test-helpers';
import {
  EslintSummaryTask,
  readEslintConfig,
  ACCEPTED_ESLINT_CONFIG_FILES,
} from '../src/tasks/eslint-summary-task';
import EslintSummaryTaskResult from '../src/results/eslint-summary-task-result';
import { PackageJson } from 'type-fest';
import { CLIEngine } from 'eslint';

describe('eslint-summary-task', () => {
  let project: CheckupProject;

  beforeEach(() => {
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
  });

  afterEach(() => {
    project.dispose();
  });

  it('it summarizes eslint and outputs to console', async () => {
    const result = await new EslintSummaryTask(
      'meta',
      getTaskContext({
        cliFlags: { cwd: project.baseDir },
        pkg: project.pkg,
        paths: project.filePaths,
      })
    ).run();
    const taskResult = <EslintSummaryTaskResult>result;

    taskResult.toConsole();

    expect(stdout()).toMatchInlineSnapshot(`
      "=== Eslint Summary ===

      Error count: 1
      Warning count: 1

      === Errors

      Rule name Failures             
      semi      1 errors (1 fixable) 

      === Warnings

      Rule name Failures               
      no-var    1 warnings (1 fixable) 

      "
    `);
  });

  it('it summarizes eslint and outputs to JSON', async () => {
    const result = await new EslintSummaryTask(
      'meta',
      getTaskContext({
        cliFlags: { cwd: project.baseDir },
        pkg: project.pkg,
        paths: project.filePaths,
      })
    ).run();
    const taskResult = <EslintSummaryTaskResult>result;

    expect(filterResultFilePath(taskResult.toJson().result.esLintReport)).toMatchSnapshot();
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

function filterResultFilePath(report: CLIEngine.LintReport) {
  let filteredResults = report.results.map((result) => {
    result.filePath = '';
  });
  return { ...{ results: filteredResults }, ...report };
}
