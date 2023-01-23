import '@microsoft/jest-sarif';
import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import { getPluginName, FilePathArray, Task } from '@checkup/core';
import { Result, Location } from 'sarif';
import TemplateLintSummaryTask from '../src/tasks/ember-template-lint-summary-task';
import { evaluateActions } from '../src/actions/ember-template-lint-summary-actions';

describe('ember-emplate-lint-summary-task', () => {
  let project: CheckupProject;
  let pluginName = getPluginName(import.meta.url);
  let task: Task;
  let results: Result[];

  beforeAll(async () => {
    project = new CheckupProject('checkup-app', '0.0.0');
    project.files['included-path.hbs'] = `
    <div style="color:blue">
      <h1>Checkup</h1>
      <img src="foo"/>
    </div>
    WHATEVER MAN
    `;
    project.files['included-path.js'] = `
      import { hbs } from 'ember-cli-htmlbars';
      hbs\`
        <div style="color:blue">
          <h1>Checkup</h1>
          <img src="foo"/>
        </div>
        WHATEVER MAN
      \`;
    `;
    project.files['included-path.gjs'] = `
      <template>
        <div style="color:blue">
          <h1>Checkup</h1>
          <img src="foo"/>
        </div>
        WHATEVER MAN
      </template>
    `;
    project.files['included-path.ts'] = `
      import { hbs } from 'ember-cli-htmlbars';
      hbs\`
        <div style="color:blue">
          <h1>Checkup</h1>
          <img src="foo"/>
        </div>
        WHATEVER MAN
      \`;
    `;
    project.files['included-path.gts'] = `
      <template>
        <div style="color:blue">
          <h1>Checkup</h1>
          <img src="foo"/>
        </div>
        WHATEVER MAN
      </template>
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
    expect(includedPathsResults).toHaveLength(20);
  });

  it('returns correct action items if there are too many warnings or errors', async () => {
    let actions = evaluateActions(results, task.config);

    expect(actions).toHaveLength(2);
    expect(actions).toMatchInlineSnapshot(`
[
  {
    "defaultThreshold": 20,
    "details": "15 total errors",
    "input": 15,
    "items": [
      "Total template-lint errors: 15",
    ],
    "name": "reduce-template-lint-errors",
    "summary": "Reduce number of template-lint errors",
    "taskName": "ember-template-lint-summary",
  },
  {
    "defaultThreshold": 20,
    "details": "5 total warnings",
    "input": 5,
    "items": [
      "Total template-lint warnings: 5",
    ],
    "name": "reduce-template-lint-warnings",
    "summary": "Reduce number of template-lint warnings",
    "taskName": "ember-template-lint-summary",
  },
]
`);
  });
});
