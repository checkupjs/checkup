import '@microsoft/jest-sarif';
import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import TemplateLintDisableTask from '../src/tasks/ember-template-lint-disable-task';
import { evaluateActions } from '../src/actions/ember-template-lint-disable-actions';

describe('ember-template-lint-disable-task', () => {
  let project: CheckupProject;

  beforeEach(function () {
    project = new CheckupProject('foo', '0.0.0');
    project.files['index.hbs'] = `
    {{! template-lint-disable no-inline-styles }}
    <div style="color:blue">
      <h1>Checkup</h1>
      {{! template-lint-disable img-alt-attributes }}
      <img src="foo"/>
    </div>

    {{! template-lint-disable bare-strings }}
    WHATEVER MAN
    `;

    project.writeSync();
  });

  afterEach(function () {
    project.dispose();
  });

  it('finds all instances of template-lint-disable and outputs to json', async () => {
    const results = await new TemplateLintDisableTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
        options: { cwd: project.baseDir },
      })
    ).run();

    for (let result of results) {
      expect(result).toBeValidSarifFor('result');
    }
  });

  it('returns action item if there are more than 2 instances of template-lint-disable', async () => {
    const task = new TemplateLintDisableTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
        options: { cwd: project.baseDir },
      })
    );
    const result = await task.run();

    let actions = evaluateActions(result, task.config);

    expect(actions).toHaveLength(1);
    expect(actions).toMatchInlineSnapshot(`
[
  {
    "defaultThreshold": 2,
    "details": "3 usages of template-lint-disable",
    "input": 3,
    "items": [
      "Total template-lint-disable usages: 3",
    ],
    "name": "reduce-template-lint-disable-usages",
    "summary": "Reduce number of template-lint-disable usages",
    "taskName": "ember-template-lint-disable",
  },
]
`);
  });
});
