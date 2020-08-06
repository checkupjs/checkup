import { CheckupProject, getTaskContext, stableJson } from '@checkup/test-helpers';

import LinesOfCodeTask from '../../src/tasks/lines-of-code-task';

describe('lines-of-code-task', () => {
  let project: CheckupProject;

  beforeEach(function () {
    project = new CheckupProject('foo', '0.0.0');
    project.files['index.whatever'] = 'whatever';
    project.files['index.js'] = '// TODO: write better code';
    project.files['index.hbs'] = '{{!-- i should TODO: write code --}}';
    project.files['index.scss'] = `
    .foo {
      color: green;
    }
    .whatever {
      display: block;
      color: red;
      position: absolute;
    }
    `;
    project.writeSync();
  });

  afterEach(function () {
    project.dispose();
  });

  it('returns all the lines of code by type found in the app and outputs to json', async () => {
    const result = await new LinesOfCodeTask(
      'internal',
      getTaskContext({
        cliFlags: { cwd: project.baseDir },
        paths: project.filePaths,
      })
    ).run();

    const json = stableJson(result.toJson());

    expect(json).toMatchInlineSnapshot(`
      "{
        \\"info\\": {
          \\"friendlyTaskName\\": \\"Lines of Code\\",
          \\"taskClassification\\": {
            \\"category\\": \\"metrics\\"
          },
          \\"taskName\\": \\"lines-of-code\\"
        },
        \\"result\\": [
          {
            \\"data\\": [
              {
                \\"extension\\": \\"hbs\\",
                \\"filePath\\": \\"/index.hbs\\",
                \\"lines\\": 1
              },
              {
                \\"extension\\": \\"js\\",
                \\"filePath\\": \\"/index.js\\",
                \\"lines\\": 1
              },
              {
                \\"extension\\": \\"scss\\",
                \\"filePath\\": \\"/index.scss\\",
                \\"lines\\": 10
              }
            ],
            \\"dataSummary\\": {
              \\"dataKey\\": \\"extension\\",
              \\"total\\": 12,
              \\"valueKey\\": \\"lines\\",
              \\"values\\": {
                \\"hbs\\": 1,
                \\"js\\": 1,
                \\"scss\\": 10
              }
            },
            \\"key\\": \\"lines of code\\",
            \\"type\\": \\"lookup-value\\"
          }
        ]
      }"
    `);
  });
});
