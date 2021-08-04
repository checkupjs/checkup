import * as React from 'react';
import { render } from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import { Table } from '../src/components/table';

describe('Test table component', () => {
  it('can generate table component', async () => {
    const data = [
      {
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: 'addon/application/tests/my-application-test.js',
              },
              region: {
                startColumn: 17,
                startLine: 6,
              },
            },
          },
        ],
        message: {
          text: 'suppression a11y element: #inbug-nav-item1',
        },
        occurrenceCount: 1,
        properties: {
          category: 'accessibility',
          group: undefined,
          lintRuleId: 'suppression-elements',
          taskDisplayName: 'Accessibility Elements Suppression',
        },
        ruleId: 'a11y-elements-suppression',
      },
      {
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: 'addon/application/tests/my-application-test.js',
              },
              region: {
                startColumn: 17,
                startLine: 6,
              },
            },
          },
        ],
        message: {
          text: 'suppression a11y element: #inbug-nav-item2',
        },
        occurrenceCount: 1,
        properties: {
          category: 'accessibility',
          group: undefined,
          lintRuleId: 'suppression-elements',
          taskDisplayName: 'Accessibility Elements Suppression',
        },
        ruleId: 'a11y-elements-suppression',
      },
      {
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: 'addon/application/tests/my-application-test.js',
              },
              region: {
                startColumn: 17,
                startLine: 6,
              },
            },
          },
        ],
        message: {
          text: 'suppression a11y element: #inbug-nav-item3',
        },
        occurrenceCount: 1,
        properties: {
          category: 'accessibility',
          group: undefined,
          lintRuleId: 'suppression-elements',
          taskDisplayName: 'Accessibility Elements Suppression',
        },
        ruleId: 'a11y-elements-suppression',
      },
      {
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: 'addon/application/tests/my-application-test.js',
              },
              region: {
                startColumn: 17,
                startLine: 15,
              },
            },
          },
        ],
        message: {
          text: 'suppression a11y element: $fixture[0].firstChild',
        },
        occurrenceCount: 1,
        properties: {
          category: 'accessibility',
          group: undefined,
          lintRuleId: 'suppression-elements',
          taskDisplayName: 'Accessibility Elements Suppression',
        },
        ruleId: 'a11y-elements-suppression',
      },
    ];
    const { stdout } = render(<Table data={data} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
      "┌────────────────────────────────────┬─────────────┬───────────┬───────────────────────────┐
      │ taskName                           │ startColumn │ startLine │ ruleId                    │
      ├────────────────────────────────────┼─────────────┼───────────┼───────────────────────────┤
      │ Accessibility Elements Suppression │ 17          │ 6         │ a11y-elements-suppression │
      ├────────────────────────────────────┼─────────────┼───────────┼───────────────────────────┤
      │ Accessibility Elements Suppression │ 17          │ 6         │ a11y-elements-suppression │
      ├────────────────────────────────────┼─────────────┼───────────┼───────────────────────────┤
      │ Accessibility Elements Suppression │ 17          │ 6         │ a11y-elements-suppression │
      ├────────────────────────────────────┼─────────────┼───────────┼───────────────────────────┤
      │ Accessibility Elements Suppression │ 17          │ 15        │ a11y-elements-suppression │
      └────────────────────────────────────┴─────────────┴───────────┴───────────────────────────┘"
    `);
  });
});
