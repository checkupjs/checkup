import * as React from 'react';
import { render } from 'ink-testing-library';
import { RuleResults } from '@checkup/core';
import { Table } from '../../src/components/table';

const stripAnsi = require('strip-ansi');

describe('Test table component', () => {
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
          component: 'table',
        },
      },
      results: [
        {
          message: {
            text: 'Ember dependency information for ember-composable-helpers',
          },
          ruleId: 'ember-dependencies',
          properties: {
            packageName: 'ember-composable-helpers',
            packageVersion: '^2.1.0',
            latestVersion: '4.5.0',
            type: 'devDependency',
            data: {
              packageName: 'ember-composable-helpers',
              packageVersion: '^2.1.0',
            },
          },
        },
      ],
    };

    const { stdout } = render(<Table taskResult={taskResult} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
      "Ember Dependencies
      ┌──────────────────────────┬────────────────┐
      │ packageName              │ packageVersion │
      ├──────────────────────────┼────────────────┤
      │ ember-composable-helpers │ ^2.1.0         │
      └──────────────────────────┴────────────────┘"
    `);
  });
});
