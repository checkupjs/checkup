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
      "Lines of Code

      File type   Total       TODO 
      hbs         1           1    
      js          1           1    
      scss        10          0    
      json        7           N/A  

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
        "result": Object {
          "fileResults": Array [
            Object {
              "errors": Array [],
              "fileExension": "hbs",
              "results": Object {
                "block": 1,
                "blockEmpty": 0,
                "comment": 1,
                "empty": 0,
                "mixed": 0,
                "single": 0,
                "source": 0,
                "todo": 1,
                "total": 1,
              },
            },
            Object {
              "errors": Array [],
              "fileExension": "js",
              "results": Object {
                "block": 0,
                "blockEmpty": 0,
                "comment": 1,
                "empty": 0,
                "mixed": 0,
                "single": 1,
                "source": 0,
                "todo": 1,
                "total": 1,
              },
            },
            Object {
              "errors": Array [],
              "fileExension": "scss",
              "results": Object {
                "block": 0,
                "blockEmpty": 0,
                "comment": 0,
                "empty": 2,
                "mixed": 0,
                "single": 0,
                "source": 8,
                "todo": 0,
                "total": 10,
              },
            },
            Object {
              "errors": Array [],
              "fileExension": "json",
              "results": Object {
                "block": "N/A",
                "blockEmpty": "N/A",
                "comment": "N/A",
                "empty": "N/A",
                "mixed": "N/A",
                "single": "N/A",
                "source": "N/A",
                "todo": "N/A",
                "total": 7,
              },
            },
          ],
        },
      }
    `);
  });
});
