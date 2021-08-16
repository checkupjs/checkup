import * as React from 'react';
import { render } from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import { Bar } from '../src/components/bar';
import { BarData } from '../src/types';

describe('Test Bar component', () => {
  it('can generate bar component', async () => {
    const data: BarData = {
      name: 'test-item',
      value: 10,
      total: 20,
    };

    const { lastFrame } = render(<Bar data={data}></Bar>);
    expect(stripAnsi(lastFrame()!)).toMatchInlineSnapshot(
      `"■■■■■■■■■■■■■■■■■■■■■■■■■ test-item (10)"`
    );
  });
});
