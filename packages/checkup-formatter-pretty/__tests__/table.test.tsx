import * as React from 'react';
// eslint-disable-next-line node/no-unpublished-import
import { render } from 'ink-testing-library';
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
    expect(stdout.lastFrame()).toMatchInlineSnapshot(`
      "[1m──────────────────────[22m[1m─────────────────────────────[22m[1m┬[22m[1m──────────────────────────────[22m[1m┬[22m[1m────────────────[22m[1m┐[22m
      [1m─────────────[22m         [1m──────────────────[22m            [1m───────────────────[22m            [1m──────────[22m
      [1m[34m taskName             [22m[39m[1m[34m uri                         [39m[22m[1m│[22m[1m[34m message                      [39m[22m[1m│[22m[1m[34m ruleId         [39m[22m[1m│[22m
      [1m[34m             [39m[22m         [1m[34m                  [39m[22m            [1m[34m                   [39m[22m            [1m[34m          [39m[22m
      [1m──────────────────────[22m[1m─────────────────────────────[22m[1m┼[22m[1m──────────────────────────────[22m[1m┼[22m[1m────────────────[22m[1m┤[22m
      [1m─────────────[22m         [1m──────────────────[22m            [1m───────────────────[22m            [1m──────────[22m
       Accessibility Element addon/application/tests/my-a[1m│[22m suppression a11y element:    [1m│[22m a11y-elements-s[1m│[22m
       Suppression          plication-test.js             #inbug-nav-item1               ppression
      [1m──────────────────────[22m[1m─────────────────────────────[22m[1m┼[22m[1m──────────────────────────────[22m[1m┼[22m[1m────────────────[22m[1m┤[22m
      [1m─────────────[22m         [1m──────────────────[22m            [1m───────────────────[22m            [1m──────────[22m
       Accessibility Element addon/application/tests/my-a[1m│[22m suppression a11y element:    [1m│[22m a11y-elements-s[1m│[22m
       Suppression          plication-test.js             #inbug-nav-item2               ppression
      [1m──────────────────────[22m[1m─────────────────────────────[22m[1m┼[22m[1m──────────────────────────────[22m[1m┼[22m[1m────────────────[22m[1m┤[22m
      [1m─────────────[22m         [1m──────────────────[22m            [1m───────────────────[22m            [1m──────────[22m
       Accessibility Element addon/application/tests/my-a[1m│[22m suppression a11y element:    [1m│[22m a11y-elements-s[1m│[22m
       Suppression          plication-test.js             #inbug-nav-item3               ppression
      [1m──────────────────────[22m[1m─────────────────────────────[22m[1m┼[22m[1m──────────────────────────────[22m[1m┼[22m[1m────────────────[22m[1m┤[22m
      [1m─────────────[22m         [1m──────────────────[22m            [1m───────────────────[22m            [1m──────────[22m
       Accessibility Element addon/application/tests/my-a[1m│[22m suppression a11y element:    [1m│[22m a11y-elements-s[1m│[22m
       Suppression          plication-test.js             $fixture[0].firstChild         ppression
      [1m──────────────────────[22m[1m─────────────────────────────[22m[1m┴[22m[1m──────────────────────────────[22m[1m┴[22m[1m────────────────[22m[1m┘[22m
      [1m─────────────[22m         [1m──────────────────[22m            [1m───────────────────[22m            [1m──────────[22m"
    `);
  });
});
