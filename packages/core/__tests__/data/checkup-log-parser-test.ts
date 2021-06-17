import { resolve } from 'path';
import { readJsonSync } from 'fs-extra';
import CheckupLogParser from '../../src/data/checkup-log-parser';

describe('checkup-log-parser-test', () => {
  it('can parse a single task log', () => {
    let log = readJsonSync(resolve(__dirname, '../__fixtures__/checkup-result-single-task.sarif'));

    let logParser = new CheckupLogParser(log);

    expect(logParser.metaData.cli).toMatchInlineSnapshot(`
      Object {
        "config": Object {
          "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/config/config-schema.json",
          "excludePaths": Array [],
          "plugins": Array [
            "checkup-plugin-javascript",
            "checkup-plugin-ember",
          ],
          "tasks": Object {},
        },
        "configHash": "7bca477eada135bcfae0876e271fff89",
        "schema": 1,
        "version": "1.0.0-beta.11",
      }
    `);
    expect(logParser.metaData.project).toMatchInlineSnapshot(`
      Object {
        "name": "travis",
        "repository": Object {
          "activeDays": "1448",
          "age": "9 years",
          "linesOfCode": Object {
            "total": 101513,
            "types": Array [
              Object {
                "extension": "js",
                "total": 49161,
              },
              Object {
                "extension": "svg",
                "total": 24112,
              },
              Object {
                "extension": "scss",
                "total": 14936,
              },
              Object {
                "extension": "hbs",
                "total": 12464,
              },
              Object {
                "extension": "rb",
                "total": 639,
              },
              Object {
                "extension": "html",
                "total": 201,
              },
            ],
          },
          "totalCommits": 5983,
          "totalFiles": 1667,
        },
        "version": "0.0.1",
      }
    `);
    expect(logParser.rules).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "ember-types",
          "properties": Object {
            "category": "metrics",
            "taskDisplayName": "Ember Types",
          },
          "shortDescription": Object {
            "text": "Gets a breakdown of all Ember types in an Ember.js project",
          },
        },
      ]
    `);
    expect(logParser.results).toHaveLength(810);
  });

  it('can parse a multiple task log', () => {
    let log = readJsonSync(resolve(__dirname, '../__fixtures__/checkup-result-all-tasks.sarif'));

    let logParser = new CheckupLogParser(log);

    expect(logParser.metaData.cli).toMatchInlineSnapshot(`
      Object {
        "config": Object {
          "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/config/config-schema.json",
          "excludePaths": Array [],
          "plugins": Array [
            "checkup-plugin-javascript",
            "checkup-plugin-ember",
          ],
          "tasks": Object {},
        },
        "configHash": "7bca477eada135bcfae0876e271fff89",
        "schema": 1,
        "version": "1.0.0-beta.11",
      }
    `);
    expect(logParser.metaData.project).toMatchInlineSnapshot(`
      Object {
        "name": "travis",
        "repository": Object {
          "activeDays": "1448",
          "age": "9 years",
          "linesOfCode": Object {
            "total": 101513,
            "types": Array [
              Object {
                "extension": "js",
                "total": 49161,
              },
              Object {
                "extension": "svg",
                "total": 24112,
              },
              Object {
                "extension": "scss",
                "total": 14936,
              },
              Object {
                "extension": "hbs",
                "total": 12464,
              },
              Object {
                "extension": "rb",
                "total": 639,
              },
              Object {
                "extension": "html",
                "total": 201,
              },
            ],
          },
          "totalCommits": 5983,
          "totalFiles": 1667,
        },
        "version": "0.0.1",
      }
    `);
    expect(logParser.rules).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "ember-types",
          "properties": Object {
            "category": "metrics",
            "taskDisplayName": "Ember Types",
          },
          "shortDescription": Object {
            "text": "Gets a breakdown of all Ember types in an Ember.js project",
          },
        },
        Object {
          "id": "eslint-summary",
          "properties": Object {
            "category": "linting",
            "taskDisplayName": "Eslint Summary",
          },
          "shortDescription": Object {
            "text": "Gets a summary of all eslint results in a project",
          },
        },
        Object {
          "id": "ember-test-types",
          "properties": Object {
            "category": "testing",
            "taskDisplayName": "Test Types",
          },
          "shortDescription": Object {
            "text": "Gets a breakdown of all test types in an Ember.js project",
          },
        },
        Object {
          "id": "ember-octane-migration-status-native-classes",
          "properties": Object {
            "parentRuleID": "ember-octane-migration-status",
            "taskDisplayName": "Ember Octane Migration | Native Classes",
          },
          "shortDescription": Object {
            "text": "Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project",
          },
        },
        Object {
          "id": "ember-octane-migration-status-glimmer-components",
          "properties": Object {
            "parentRuleID": "ember-octane-migration-status",
            "taskDisplayName": "Ember Octane Migration | Glimmer Components",
          },
          "shortDescription": Object {
            "text": "Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project",
          },
        },
        Object {
          "id": "ember-octane-migration-status-tagless-components",
          "properties": Object {
            "parentRuleID": "ember-octane-migration-status",
            "taskDisplayName": "Ember Octane Migration | Tagless Components",
          },
          "shortDescription": Object {
            "text": "Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project",
          },
        },
        Object {
          "id": "ember-octane-migration-status-tracked-properties",
          "properties": Object {
            "parentRuleID": "ember-octane-migration-status",
            "taskDisplayName": "Ember Octane Migration | Tracked Properties",
          },
          "shortDescription": Object {
            "text": "Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project",
          },
        },
        Object {
          "id": "ember-template-lint-summary",
          "properties": Object {
            "category": "linting",
            "taskDisplayName": "Template Lint Summary",
          },
          "shortDescription": Object {
            "text": "Gets a summary of all ember-template-lint results in an Ember.js project",
          },
        },
        Object {
          "id": "eslint-disables",
          "properties": Object {
            "category": "linting",
            "taskDisplayName": "Number of eslint-disable Usages",
          },
          "shortDescription": Object {
            "text": "Finds all disabled eslint rules in a project",
          },
        },
        Object {
          "id": "outdated-dependencies",
          "properties": Object {
            "category": "dependencies",
            "taskDisplayName": "Outdated Dependencies",
          },
          "shortDescription": Object {
            "text": "Gets a summary of all outdated dependencies in a project",
          },
        },
        Object {
          "id": "ember-dependencies",
          "properties": Object {
            "category": "dependencies",
            "taskDisplayName": "Ember Dependencies",
          },
          "shortDescription": Object {
            "text": "Finds Ember-specific dependencies and their versions in an Ember.js project",
          },
        },
      ]
    `);
    expect(logParser.results).toHaveLength(3019);
  });
});
