import * as React from 'react';
import { render } from 'ink-testing-library';
import { RuleResults } from '@checkup/core';
import { Migration } from '../../src/components/migration';
import { getSorter } from '../../src/get-sorter';

const merge = require('lodash.merge');
const stripAnsi = require('strip-ansi');

const TASK_RESULT: RuleResults = {
  rule: {
    id: 'ember-octane-migration-status',
    shortDescription: {
      text:
        'Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project',
    },
    properties: {
      taskDisplayName: 'Ember Octane Migration Status',
      category: 'migrations',
      component: {
        name: 'migration',
      },
      features: [
        'Native Classes',
        'Glimmer Components',
        'Native Classes',
        'Tagless Components',
        'Tracked Properties',
        'Angle Bracket Syntax',
        'Named Arguments',
        'Own Properties',
        'Modifiers',
      ],
    },
  },
  results: [
    {
      message: {
        text:
          'Octane | Native Classes : Use native JS classes to extend the built-in classes provided by Ember. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
      },
      ruleId: 'ember-octane-migration-status',
      kind: 'review',
      level: 'warning',
      properties: {
        migration: {
          name: 'ember-octane-migration',
          displayName: 'Ember Octane Migration',
          feature: 'Native Classes',
        },
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: {
              uri: 'app/adapters/application.js',
            },
            region: {
              startLine: 5,
              startColumn: 16,
              endLine: 56,
              endColumn: 3,
            },
          },
        },
      ],
      ruleIndex: 0,
    },
    {
      message: {
        text:
          'Octane | Native Classes : Use native JS classes to extend the built-in classes provided by Ember. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
      },
      ruleId: 'ember-octane-migration-status',
      kind: 'review',
      level: 'warning',
      properties: {
        migration: {
          name: 'ember-octane-migration',
          displayName: 'Ember Octane Migration',
          feature: 'Native Classes',
        },
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: {
              uri: 'app/app.js',
            },
            region: {
              startLine: 12,
              startColumn: 13,
              endLine: 45,
              endColumn: 3,
            },
          },
        },
      ],
      ruleIndex: 0,
    },
    {
      message: {
        text:
          'Octane | Glimmer Components : Use native DOM APIs over jQuery. More info: https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-jquery.md',
      },
      ruleId: 'ember-octane-migration-status',
      kind: 'review',
      level: 'warning',
      properties: {
        migration: {
          name: 'ember-octane-migration',
          displayName: 'Ember Octane Migration',
          feature: 'Glimmer Components',
        },
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: {
              uri: 'app/app.js',
            },
            region: {
              startLine: 12,
              startColumn: 13,
              endLine: 45,
              endColumn: 3,
            },
          },
        },
      ],
      ruleIndex: 0,
    },
    {
      message: {
        text:
          'Octane | Tagless Components : Use tagless components to avoid unnecessary outer element wrapping. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__tag-name',
      },
      ruleId: 'ember-octane-migration-status',
      kind: 'review',
      level: 'warning',
      properties: {
        migration: {
          name: 'ember-octane-migration',
          displayName: 'Ember Octane Migration',
          feature: 'Tagless Components',
        },
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: {
              uri: 'app/app.js',
            },
            region: {
              startLine: 12,
              startColumn: 13,
              endLine: 45,
              endColumn: 3,
            },
          },
        },
      ],
      ruleIndex: 0,
    },
  ],
};

function getTaskResult(componentOptions = {}) {
  return merge({}, TASK_RESULT, componentOptions);
}

describe('Migration component', () => {
  it('can render task result with no sort options', async () => {
    const { stdout } = render(<Migration taskResult={getTaskResult()} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
"Ember Octane Migration Status
=============================
Outstanding features to be migrated: 4
  Native Classes 2
  Glimmer Components 1
  Tagless Components 1
  Tracked Properties 0
  Angle Bracket Syntax 0
  Named Arguments 0
  Own Properties 0
  Modifiers 0"
`);
  });

  it('can render task result sorted by key, default to asc', async () => {
    const { stdout } = render(
      <Migration
        taskResult={getTaskResult({
          rule: {
            properties: {
              component: {
                options: {
                  sortBy: 'key',
                },
              },
            },
          },
        })}
      />
    );

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
"Ember Octane Migration Status
=============================
Outstanding features to be migrated: 4
  Angle Bracket Syntax 0
  Glimmer Components 1
  Modifiers 0
  Named Arguments 0
  Native Classes 2
  Own Properties 0
  Tagless Components 1
  Tracked Properties 0"
`);
  });

  it('can render task result sorted by key, asc', async () => {
    const { stdout } = render(
      <Migration
        taskResult={getTaskResult({
          rule: {
            properties: {
              component: {
                options: {
                  sortBy: 'key',
                  sortDirection: 'asc',
                },
              },
            },
          },
        })}
      />
    );

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
"Ember Octane Migration Status
=============================
Outstanding features to be migrated: 4
  Angle Bracket Syntax 0
  Glimmer Components 1
  Modifiers 0
  Named Arguments 0
  Native Classes 2
  Own Properties 0
  Tagless Components 1
  Tracked Properties 0"
`);
  });

  it('can render task result sorted by key, desc', async () => {
    const { stdout } = render(
      <Migration
        taskResult={getTaskResult({
          rule: {
            properties: {
              component: {
                options: {
                  sortBy: 'key',
                  sortDirection: 'desc',
                },
              },
            },
          },
        })}
      />
    );

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
"Ember Octane Migration Status
=============================
Outstanding features to be migrated: 4
  Tracked Properties 0
  Tagless Components 1
  Own Properties 0
  Native Classes 2
  Named Arguments 0
  Modifiers 0
  Glimmer Components 1
  Angle Bracket Syntax 0"
`);
  });

  it('can render task result sorted by value, asc', async () => {
    const { stdout } = render(
      <Migration
        taskResult={getTaskResult({
          rule: {
            properties: {
              component: {
                options: {
                  sortBy: 'value',
                  sortDirection: 'asc',
                },
              },
            },
          },
        })}
      />
    );

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
"Ember Octane Migration Status
=============================
Outstanding features to be migrated: 4
  Tracked Properties 0
  Angle Bracket Syntax 0
  Named Arguments 0
  Own Properties 0
  Modifiers 0
  Glimmer Components 1
  Tagless Components 1
  Native Classes 2"
`);
  });

  it('can render task result sorted by value, desc', async () => {
    const { stdout } = render(
      <Migration
        taskResult={getTaskResult({
          rule: {
            properties: {
              component: {
                options: {
                  sortBy: 'value',
                  sortDirection: 'desc',
                },
              },
            },
          },
        })}
      />
    );

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
"Ember Octane Migration Status
=============================
Outstanding features to be migrated: 4
  Native Classes 2
  Tagless Components 1
  Glimmer Components 1
  Modifiers 0
  Own Properties 0
  Named Arguments 0
  Angle Bracket Syntax 0
  Tracked Properties 0"
`);
  });
});

describe('sorters', () => {
  it('can sort keys by alpha', () => {
    let sort = getSorter('key');

    expect(
      sort(
        new Map([
          ['DDD', 4],
          ['BBB', 2],
          ['AAA', 1],
          ['CCC', 3],
        ])
      )
    ).toEqual(
      new Map([
        ['AAA', 1],
        ['BBB', 2],
        ['CCC', 3],
        ['DDD', 4],
      ])
    );
  });

  it('can sort keys by alpha, desc', () => {
    let sort = getSorter('key');

    expect(
      sort(
        new Map([
          ['DDD', 4],
          ['BBB', 2],
          ['AAA', 1],
          ['CCC', 3],
        ]),
        'desc'
      )
    ).toEqual(
      new Map([
        ['DDD', 4],
        ['CCC', 3],
        ['BBB', 2],
        ['AAA', 1],
      ])
    );
  });

  it('can sort values', () => {
    let sort = getSorter('value');

    expect(
      sort(
        new Map([
          ['DDD', 4],
          ['BBB', 2],
          ['AAA', 1],
          ['CCC', 3],
        ])
      )
    ).toEqual(
      new Map([
        ['AAA', 1],
        ['BBB', 2],
        ['CCC', 3],
        ['DDD', 4],
      ])
    );
  });

  it('can sort values, desc', () => {
    let sort = getSorter('value');

    expect(
      sort(
        new Map([
          ['DDD', 4],
          ['BBB', 2],
          ['AAA', 1],
          ['CCC', 3],
        ]),
        'desc'
      )
    ).toEqual(
      new Map([
        ['DDD', 4],
        ['CCC', 3],
        ['BBB', 2],
        ['AAA', 1],
      ])
    );
  });
});
