import FileSearcher from '../../src/searchers/file-searcher';

import Project = require('fixturify-project');

describe('file-searcher', () => {
  let project: Project;

  beforeEach(function () {
    project = new Project('foo', '3.1.4');
    project.files = {
      node_modules: {
        'lion.js': `
          function growl() {
            // TEST
            return 'rawr';
          }
          function eat() {
            // foo bar TEST bar TEST baz
            return 'bite';
          }
        `,
      },
      bar: {
        baz: {
          'snakes.js': `
            function hiss() {
              // TEST
              return 'hiss';
            }
            function test() {
              // foo bar TEST bar TEST baz
              return 'bite';
            }
          `,
        },
        spaz: {
          'pets.js': `
          function meow() {
            // meow test
            return 'cat';
          }
          function woof() {
            // TEST doggie test canine
            return 'dog';
          }
        `,
        },
      },
    };
    project.writeSync();
  });

  afterEach(function () {
    project.dispose();
  });

  test('it should find strings in files', async () => {
    let fileSearcher = new FileSearcher(project.baseDir, {
      test: ['TEST', 'test'],
      bite: ['bite'],
    });
    let stringsFound = await fileSearcher.findStrings();
    expect(stringsFound.counts).toMatchInlineSnapshot(`
      Object {
        "bite": 1,
        "test": 7,
      }
    `);
  });

  test('it should find files', async () => {
    let fileSearcher = new FileSearcher(project.baseDir, {
      animals: ['**/pets*', '**/snakes*'],
    });
    let count = await fileSearcher.findFiles();
    expect(count).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Array [
            "bar/spaz/pets.js",
            "bar/baz/snakes.js",
          ],
          "displayName": "Animals",
          "total": 2,
          "type": "animals",
        },
      ]
    `);
  });
});
