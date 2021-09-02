import { resolve } from 'path';
import * as React from 'react';
import { render } from 'ink-testing-library';
import { readJsonSync } from 'fs-extra';
import { CheckupLogParser } from '@checkup/core';
import { Table } from '../../src/components/table';

const stripAnsi = require('strip-ansi');

describe('Test table component', () => {
  it('can render task result as expected via table component', async () => {
    const log = readJsonSync(resolve(__dirname, '../__fixtures__/checkup-result.sarif'));
    const logParser = new CheckupLogParser(log);
    const taskResults = logParser.resultsByRule;
    const taskResult = [...taskResults.values()][0];

    const { stdout } = render(<Table taskResult={taskResult} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
      "┌─────────────┬───────┐
      │ ruleId      │ total │
      ├─────────────┼───────┤
      │ ember-types │ 810   │
      └─────────────┴───────┘"
    `);
  });
});
