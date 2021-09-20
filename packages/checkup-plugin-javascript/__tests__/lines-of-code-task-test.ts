import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import { getPluginName } from '@checkup/core';
import LinesOfCodeTask from '../src/tasks/lines-of-code-task';

describe('lines-of-code-task', () => {
  let project: CheckupProject;
  let pluginName = getPluginName(__dirname);

  beforeEach(() => {
    project = new CheckupProject('checkup-app', '0.0.0', (project) => {
      project.files['index.js'] = 'module.exports = {};';
      project.files['index.hbs'] = '<div>Checkup App</div>';
    });

    project.writeSync();
    project.gitInit();
  });

  afterEach(() => {
    project.dispose();
  });

  it('can read task as JSON', async () => {
    const result = await new LinesOfCodeTask(
      pluginName,
      getTaskContext({
        options: { cwd: project.baseDir },
        pkg: project.pkg,
      })
    ).run();

    expect(result).toMatchInlineSnapshot(`
Array [
  Object {
    "kind": "informational",
    "level": "note",
    "locations": Array [
      Object {
        "physicalLocation": Object {
          "artifactLocation": Object {
            "uri": "index.hbs",
          },
        },
      },
    ],
    "message": Object {
      "text": "Lines of code count for index.hbs - total lines: 1",
    },
    "properties": Object {
      "extension": "hbs",
      "filePath": "index.hbs",
      "lines": 1,
    },
    "ruleId": "lines-of-code",
    "ruleIndex": 0,
  },
  Object {
    "kind": "informational",
    "level": "note",
    "locations": Array [
      Object {
        "physicalLocation": Object {
          "artifactLocation": Object {
            "uri": "index.js",
          },
        },
      },
    ],
    "message": Object {
      "text": "Lines of code count for index.js - total lines: 1",
    },
    "properties": Object {
      "extension": "js",
      "filePath": "index.js",
      "lines": 1,
    },
    "ruleId": "lines-of-code",
    "ruleIndex": 0,
  },
]
`);
  });
});
