import * as React from 'react';
import { render } from 'ink-testing-library';
import { RuleResults } from '@checkup/core';
import { Migration } from '../../src/components/migration';

const stripAnsi = require('strip-ansi');

describe('Test Migration component', () => {
  it('can render task result as expected via migration component', async () => {
    const taskResult: RuleResults = {
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
            'Native Classes',
            'Native Classes',
            'Native Classes',
            'Glimmer Components',
            'Native Classes',
            'Native Classes',
            'Glimmer Components',
            'Native Classes',
            'Tagless Components',
            'Glimmer Components',
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
      ],
    };

    const { stdout } = render(<Migration taskResult={taskResult} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
"Ember Octane Migration Status
=============================
Outstanding features to be migrated: 2
  Native Classes 2
  Glimmer Components 0
  Tagless Components 0
  Tracked Properties 0
  Angle Bracket Syntax 0
  Named Arguments 0
  Own Properties 0
  Modifiers 0"
`);
  });
});
