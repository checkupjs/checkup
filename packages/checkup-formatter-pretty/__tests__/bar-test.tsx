import * as React from 'react';
import { render } from 'ink-testing-library';
import { Bar } from '../src/utils/bar';
import { BarData } from '../src/types';

const stripAnsi = require('strip-ansi');

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
