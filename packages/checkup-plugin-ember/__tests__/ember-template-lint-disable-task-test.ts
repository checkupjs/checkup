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
    const result = await new TemplateLintDisableTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
        options: { cwd: project.baseDir },
      })
    ).run();

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "locations": Array [
            Object {
              "physicalLocation": Object {
                "artifactLocation": Object {
                  "uri": "index.hbs",
                },
                "region": Object {
                  "startColumn": 4,
                  "startLine": 2,
                },
              },
            },
          ],
          "message": Object {
            "text": "ember-template-lint-disable usages",
          },
          "occurrenceCount": 1,
          "properties": Object {
            "category": "linting",
            "group": "disabled-lint-rules",
            "lintRuleId": "no-ember-template-lint-disable",
            "taskDisplayName": "Number of template-lint-disable Usages",
          },
          "ruleId": "ember-template-lint-disables",
        },
        Object {
          "locations": Array [
            Object {
              "physicalLocation": Object {
                "artifactLocation": Object {
                  "uri": "index.hbs",
                },
                "region": Object {
                  "startColumn": 6,
                  "startLine": 5,
                },
              },
            },
          ],
          "message": Object {
            "text": "ember-template-lint-disable usages",
          },
          "occurrenceCount": 1,
          "properties": Object {
            "category": "linting",
            "group": "disabled-lint-rules",
            "lintRuleId": "no-ember-template-lint-disable",
            "taskDisplayName": "Number of template-lint-disable Usages",
          },
          "ruleId": "ember-template-lint-disables",
        },
        Object {
          "locations": Array [
            Object {
              "physicalLocation": Object {
                "artifactLocation": Object {
                  "uri": "index.hbs",
                },
                "region": Object {
                  "startColumn": 4,
                  "startLine": 9,
                },
              },
            },
          ],
          "message": Object {
            "text": "ember-template-lint-disable usages",
          },
          "occurrenceCount": 1,
          "properties": Object {
            "category": "linting",
            "group": "disabled-lint-rules",
            "lintRuleId": "no-ember-template-lint-disable",
            "taskDisplayName": "Number of template-lint-disable Usages",
          },
          "ruleId": "ember-template-lint-disables",
        },
      ]
    `);
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
      Array [
        Object {
          "defaultThreshold": 2,
          "details": "3 usages of template-lint-disable",
          "input": 3,
          "items": Array [
            "Total template-lint-disable usages: 3",
          ],
          "name": "reduce-template-lint-disable-usages",
          "summary": "Reduce number of template-lint-disable usages",
        },
      ]
    `);
  });
});
