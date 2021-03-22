import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import { getPluginName, FilePathArray, Task } from '@checkup/core';
import TemplateLintSummaryTask from '../src/tasks/ember-template-lint-summary-task';
import { evaluateActions } from '../src/actions/ember-template-lint-summary-actions';
import { Result, Location } from 'sarif';

describe('ember-emplate-lint-summary-task', () => {
  let project: CheckupProject;
  let pluginName = getPluginName(__dirname);
  let task: Task;
  let result: Result[];

  beforeAll(async () => {
    project = new CheckupProject('checkup-app', '0.0.0');
    project.files['included-path.hbs'] = `
    <div style="color:blue">
      <h1>Checkup</h1>
      <img src="foo"/>
    </div>
    WHATEVER MAN
    `;
    project.files['excluded-path.hbs'] = `
    LALALALALALALA
    `;
    project.files['.template-lintrc.js'] = `module.exports = {
        rules: {
            'no-bare-strings': 'error',
            'require-valid-alt-text': 'warn',
            'no-inline-styles': 'error'
        }
      };`;

    project.writeSync();
    project.gitInit();
    project.install();

    task = new TemplateLintSummaryTask(
      pluginName,
      getTaskContext({
        options: { cwd: project.baseDir },
        pkg: project.pkg,
        paths: project.filePaths.filter((path) => path.includes('included-path')) as FilePathArray,
        config: {
          tasks: {
            'ember/ember-template-lint-summary': [
              'on',
              {
                actions: {
                  'reduce-template-lint-errors': ['on', { threshold: 0 }],
                  'reduce-template-lint-warnings': ['on', { threshold: 0 }],
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

  it('summarizes eslint and outputs to JSON', async () => {
    expect(result).toMatchSnapshot();
  });

  it('only lints the files passed in via paths array', async () => {
    let excludedPathsResults = result.filter(
      (resultData: Result) =>
        (
          resultData.locations?.filter((fileLocation: Location) => {
            return fileLocation?.physicalLocation?.artifactLocation?.uri?.includes('excluded-path');
          }) || []
        ).length > 0
    );

    let includedPathsResults = result.filter(
      (resultData: Result) =>
        (
          resultData.locations?.filter((fileLocation: Location) => {
            return fileLocation?.physicalLocation?.artifactLocation?.uri?.includes('included-path');
          }) || []
        ).length > 0
    );

    expect(excludedPathsResults).toHaveLength(0);
    expect(includedPathsResults).toHaveLength(4);
  });

  it('returns correct action items if there are too many warnings or errors', async () => {
    let actions = evaluateActions(result, task.config);

    expect(actions).toHaveLength(2);
    expect(actions).toMatchInlineSnapshot(`
      Array [
        Object {
          "defaultThreshold": 20,
          "details": "3 total errors",
          "input": 3,
          "items": Array [
            "Total template-lint errors: 3",
          ],
          "name": "reduce-template-lint-errors",
          "summary": "Reduce number of template-lint errors",
        },
        Object {
          "defaultThreshold": 20,
          "details": "1 total warnings",
          "input": 1,
          "items": Array [
            "Total template-lint warnings: 1",
          ],
          "name": "reduce-template-lint-warnings",
          "summary": "Reduce number of template-lin warnings",
        },
      ]
    `);
  });
});
