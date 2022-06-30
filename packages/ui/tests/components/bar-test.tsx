import { resolve } from 'path';
import * as React from 'react';
import { render } from 'ink-testing-library';
import { readJsonSync } from 'fs-extra';
import { CheckupLogParser, dirname } from '@checkup/core';
import stripAnsi from 'strip-ansi';
import { Bar } from '../../src/components/Bar';

describe('Bar', () => {
  it('can render task result as expected via bar component', async () => {
    const log = readJsonSync(resolve(dirname(import.meta), '../__fixtures__/checkup-result.sarif'));
    const logParser = new CheckupLogParser(log);
    const taskResults = logParser.resultsByRule;
    const taskResult = [...taskResults.values()][0];

    const { stdout } = render(<Bar taskResult={taskResult} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(
      `"■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ ember-types (839)"`
    );
  });
});
