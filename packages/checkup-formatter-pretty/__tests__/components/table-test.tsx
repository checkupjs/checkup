import * as React from 'react';
import { render } from 'ink-testing-library';
import { RuleResults } from '@checkup/core';
import { Table } from '../../src/components/table.js';

const stripAnsi = require('strip-ansi');

describe('table component', () => {
  it('can render task result as expected via table component', async () => {
    const taskResult: RuleResults = {
      rule: {
        id: 'ember-dependencies',
        shortDescription: {
          text: 'Finds Ember-specific dependencies and their versions in an Ember.js project',
        },
        properties: {
          taskDisplayName: 'Ember Dependencies',
          category: 'dependencies',
          component: {
            name: 'table',
            options: {
              rows: {
                Dependency: 'properties.packageName',
                Installed: 'properties.packageVersion',
                Latest: 'properties.latestVersion',
              },
            },
          },
        },
      },
      results: [
        {
          message: {
            text: 'Ember dependency information for ember-animated',
          },
          ruleId: 'ember-dependencies',
          kind: 'review',
          level: 'note',
          properties: {
            packageName: 'ember-animated',
            packageVersion: '^0.9.0',
            latestVersion: '0.11.0',
            type: 'devDependency',
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: '/Users/zhanwang/personal/travis-web/package.json',
                },
                region: {
                  startLine: 34,
                  startColumn: 4,
                  endLine: 34,
                  endColumn: 30,
                },
              },
            },
          ],
          ruleIndex: 4,
        },
      ],
    };

    const { stdout } = render(<Table taskResult={taskResult} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
      "Ember Dependencies
      ==================
        ┌────────────────┬───────────┬────────┐
        │ Dependency     │ Installed │ Latest │
        ├────────────────┼───────────┼────────┤
        │ ember-animated │ ^0.9.0    │ 0.11.0 │
        └────────────────┴───────────┴────────┘"
    `);
  });
});
