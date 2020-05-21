import { findStrings } from '../../src/searchers/file-searcher';
import { CheckupProject, filterTaskItemDataJson } from '@checkup/test-helpers';

describe('file-searcher', () => {
  let project: CheckupProject;

  beforeEach(function () {
    project = new CheckupProject('foo', '3.1.4');
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
    let stringsFound = await findStrings(project.getFilePaths(), [
      { patternName: 'test', patterns: ['TEST', 'test'] },
      { patternName: 'bite', patterns: ['bite'] },
    ]);
    expect(filterTaskItemDataJson(stringsFound.results)).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Array [],
          "displayName": "Test",
          "total": 14,
          "type": "test",
        },
        Object {
          "data": Array [],
          "displayName": "Bite",
          "total": 1,
          "type": "bite",
        },
      ]
    `);
  });
});
