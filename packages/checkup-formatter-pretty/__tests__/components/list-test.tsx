import * as React from 'react';
import { render } from 'ink-testing-library';
import { RuleResults } from '@checkup/core';
import { List } from '../../src/components/list';

const stripAnsi = require('strip-ansi');

describe('Test list component', () => {
  it('can render task result as expected via list component', async () => {
    const taskResult: RuleResults = {
      rule: {
        id: 'eslint-disables',
        shortDescription: {
          text: 'Finds all disabled eslint rules in a project',
        },
        properties: {
          taskDisplayName: 'Number of eslint-disable Usages',
          category: 'linting',
          component: {
            name: 'list',
            data: [
              {
                title: 'Total Disables',
                value: 27,
              },
            ],
          },
        },
      },
      results: [],
    };

    const { stdout } = render(<List taskResult={taskResult} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
      "Number of eslint-disable Usages
      Total Disables 27"
    `);
  });
});
