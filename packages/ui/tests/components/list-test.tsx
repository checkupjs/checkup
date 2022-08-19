import * as React from 'react';
import { render } from 'ink-testing-library';
import { RuleResults } from '@checkup/core';
import stripAnsi from 'strip-ansi';
import { List } from '../../src/components/List';

describe('List', () => {
  it('can render task result as expected via list component', async () => {
    const taskResult: RuleResults = {
      rule: {
        id: 'ember-template-lint-summary',
        shortDescription: {
          text: 'Gets a summary of all ember-template-lint results in an Ember.js project',
        },
        properties: {
          taskDisplayName: 'Template Lint Summary',
          category: 'linting',
          component: {
            name: 'list',
            options: {
              items: {
                Errors: {
                  groupBy: 'level',
                  value: 'error',
                },
                Warnings: {
                  groupBy: 'level',
                  value: 'warning',
                },
              },
            },
          },
        },
      },
      results: [
        {
          message: {
            text: 'Do not use `action` as <button {{action ...}} />. Instead, use the `on` modifier and `fn` helper.',
          },
          ruleId: 'ember-template-lint-summary',
          kind: 'review',
          level: 'error',
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: 'app/templates/account/settings.hbs',
                },
                region: {
                  startLine: 10,
                  startColumn: 53,
                  endLine: 10,
                  endColumn: 53,
                },
              },
            },
          ],
          ruleIndex: 1,
        },
      ],
    };

    const { stdout } = render(<List taskResult={taskResult} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
      "Template Lint Summary
      =====================
        Errors 1
        Warnings 0"
    `);
  });
});
