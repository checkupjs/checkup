import { resolve } from 'path';
import * as React from 'react';
import { render } from 'ink-testing-library';
import { readJsonSync } from 'fs-extra';
import { CheckupLogParser } from '@checkup/core';
import { List } from '../../src/components/list';

const stripAnsi = require('strip-ansi');

describe('Test table component', () => {
  it('can render task result as expected via table component', async () => {
    const log = readJsonSync(resolve(__dirname, '../__fixtures__/checkup-result.sarif'));
    const logParser = new CheckupLogParser(log);
    const taskResults = logParser.resultsByRule;
    const taskResult = [...taskResults.values()][0];

    const { stdout } = render(<List taskResult={taskResult} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
      "Ember Types
      Total: 810"
    `);
  });
});
