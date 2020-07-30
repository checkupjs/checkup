import { CheckupProject, stdout, getTaskContext } from '@checkup/test-helpers';

import LinesOfCodeTask from '../../src/tasks/lines-of-code-task';
import LinesOfCodeTaskResult from '../../src/results/lines-of-code-task-result';

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

  it('returns all the lines of code by type found in the app and outputs to the console', async () => {
    const result = await new LinesOfCodeTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
      })
    ).run();
    const linesOfCodeResult = <LinesOfCodeTaskResult>result;

    linesOfCodeResult.toConsole();

    expect(stdout()).toMatchInlineSnapshot(`
      "Lines Of Code

      ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 12 files
      ■ scss (10)
      ■ hbs (1)
      ■ js (1)

      "
    `);

    // random file extensions not supported by SLOC or checkup are not included in results
    expect(stdout()).not.toContain('whatever');
  });

  it('returns all the lines of code by type found in the app and outputs to json', async () => {
    const result = await new LinesOfCodeTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
      })
    ).run();
    const linesOfCodeResult = <LinesOfCodeTaskResult>result;

    const json = linesOfCodeResult.toJson();

    expect(json).toMatchInlineSnapshot(`
      Object {
        "info": Object {
          "friendlyTaskName": "Lines of Code",
          "taskClassification": Object {
            "category": "metrics",
          },
          "taskName": "lines-of-code",
        },
        "result": Array [
          Object {
            "data": Array [
              Object {
                "extension": "js",
                "filePath": "/private/var/folders/3q/5x6gzths7b97lq08vx_cb0g4000gyd/T/tmp-65173jaUr0NzM4kda/foo/indexjs",
                "lines": 1,
              },
              Object {
                "extension": "scss",
                "filePath": "/private/var/folders/3q/5x6gzths7b97lq08vx_cb0g4000gyd/T/tmp-65173jaUr0NzM4kda/foo/indexscss",
                "lines": 10,
              },
              Object {
                "extension": "hbs",
                "filePath": "/private/var/folders/3q/5x6gzths7b97lq08vx_cb0g4000gyd/T/tmp-65173jaUr0NzM4kda/foo/indexhbs",
                "lines": 1,
              },
            ],
            "dataSummary": Object {
              "dataKey": "extension",
              "total": 12,
              "valueKey": "lines",
              "values": Object {
                "hbs": 1,
                "js": 1,
                "scss": 10,
              },
            },
            "key": "lines of code",
            "type": "lookup-value",
          },
        ],
      }
    `);
  });
});
