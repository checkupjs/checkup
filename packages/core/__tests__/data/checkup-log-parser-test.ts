import { resolve } from 'path';
import { readJsonSync } from 'fs-extra';
import CheckupLogParser from '../../src/data/checkup-log-parser.js';

describe('checkup-log-parser-test', () => {
  it('can parse a single task log', () => {
    let log = readJsonSync(resolve(__dirname, '../__fixtures__/checkup-result-single-task.sarif'));

    let logParser = new CheckupLogParser(log);

    expect(logParser.metaData.cli).toMatchInlineSnapshot(`
{
  "config": {
    "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/config/config-schema.json",
    "excludePaths": [],
    "plugins": [
      "checkup-plugin-javascript",
      "checkup-plugin-ember",
    ],
    "tasks": {},
  },
  "configHash": "7bca477eada135bcfae0876e271fff89",
  "schema": 1,
  "version": "1.0.0-beta.11",
}
`);
    expect(logParser.metaData.project).toMatchInlineSnapshot(`
{
  "name": "travis",
  "repository": {
    "activeDays": "1448",
    "age": "9 years",
    "linesOfCode": {
      "total": 101513,
      "types": [
        {
          "extension": "js",
          "total": 49161,
        },
        {
          "extension": "svg",
          "total": 24112,
        },
        {
          "extension": "scss",
          "total": 14936,
        },
        {
          "extension": "hbs",
          "total": 12464,
        },
        {
          "extension": "rb",
          "total": 639,
        },
        {
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
[
  {
    "id": "ember-types",
    "properties": {
      "category": "metrics",
      "taskDisplayName": "Ember Types",
    },
    "shortDescription": {
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
{
  "config": {
    "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/config/config-schema.json",
    "excludePaths": [],
    "plugins": [
      "checkup-plugin-javascript",
      "checkup-plugin-ember",
    ],
    "tasks": {},
  },
  "configHash": "7bca477eada135bcfae0876e271fff89",
  "schema": 1,
  "version": "1.0.0-beta.11",
}
`);
    expect(logParser.metaData.project).toMatchInlineSnapshot(`
{
  "name": "travis",
  "repository": {
    "activeDays": "1448",
    "age": "9 years",
    "linesOfCode": {
      "total": 101513,
      "types": [
        {
          "extension": "js",
          "total": 49161,
        },
        {
          "extension": "svg",
          "total": 24112,
        },
        {
          "extension": "scss",
          "total": 14936,
        },
        {
          "extension": "hbs",
          "total": 12464,
        },
        {
          "extension": "rb",
          "total": 639,
        },
        {
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
[
  {
    "id": "ember-types",
    "properties": {
      "category": "metrics",
      "taskDisplayName": "Ember Types",
    },
    "shortDescription": {
      "text": "Gets a breakdown of all Ember types in an Ember.js project",
    },
  },
  {
    "id": "eslint-summary",
    "properties": {
      "category": "linting",
      "taskDisplayName": "Eslint Summary",
    },
    "shortDescription": {
      "text": "Gets a summary of all eslint results in a project",
    },
  },
  {
    "id": "ember-test-types",
    "properties": {
      "category": "testing",
      "taskDisplayName": "Test Types",
    },
    "shortDescription": {
      "text": "Gets a breakdown of all test types in an Ember.js project",
    },
  },
  {
    "id": "ember-octane-migration-status-native-classes",
    "properties": {
      "parentRuleID": "ember-octane-migration-status",
      "taskDisplayName": "Ember Octane Migration | Native Classes",
    },
    "shortDescription": {
      "text": "Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project",
    },
  },
  {
    "id": "ember-octane-migration-status-glimmer-components",
    "properties": {
      "parentRuleID": "ember-octane-migration-status",
      "taskDisplayName": "Ember Octane Migration | Glimmer Components",
    },
    "shortDescription": {
      "text": "Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project",
    },
  },
  {
    "id": "ember-octane-migration-status-tagless-components",
    "properties": {
      "parentRuleID": "ember-octane-migration-status",
      "taskDisplayName": "Ember Octane Migration | Tagless Components",
    },
    "shortDescription": {
      "text": "Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project",
    },
  },
  {
    "id": "ember-octane-migration-status-tracked-properties",
    "properties": {
      "parentRuleID": "ember-octane-migration-status",
      "taskDisplayName": "Ember Octane Migration | Tracked Properties",
    },
    "shortDescription": {
      "text": "Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project",
    },
  },
  {
    "id": "ember-template-lint-summary",
    "properties": {
      "category": "linting",
      "taskDisplayName": "Template Lint Summary",
    },
    "shortDescription": {
      "text": "Gets a summary of all ember-template-lint results in an Ember.js project",
    },
  },
  {
    "id": "eslint-disables",
    "properties": {
      "category": "linting",
      "taskDisplayName": "Number of eslint-disable Usages",
    },
    "shortDescription": {
      "text": "Finds all disabled eslint rules in a project",
    },
  },
  {
    "id": "outdated-dependencies",
    "properties": {
      "category": "dependencies",
      "taskDisplayName": "Outdated Dependencies",
    },
    "shortDescription": {
      "text": "Gets a summary of all outdated dependencies in a project",
    },
  },
  {
    "id": "ember-dependencies",
    "properties": {
      "category": "dependencies",
      "taskDisplayName": "Ember Dependencies",
    },
    "shortDescription": {
      "text": "Finds Ember-specific dependencies and their versions in an Ember.js project",
    },
  },
]
`);
    expect(logParser.results).toHaveLength(3019);
  });
});
