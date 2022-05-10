import * as React from 'react';
import { render } from 'ink-testing-library';
import { SectionedBar } from '../../src/sub-components/sectioned-bar.js';
import { BarData } from '../../src/types.js';

const stripAnsi = require('strip-ansi');

describe('Test Bar component', () => {
  it('can generate bar component', async () => {
    const data: BarData = {
      name: 'test-item',
      value: 10,
      total: 20,
    };

    const { lastFrame } = render(<SectionedBar data={data} />);
    expect(stripAnsi(lastFrame()!)).toMatchInlineSnapshot(
      `"■■■■■■■■■■■■■■■■■■■■■■■■■ test-item (10)"`
    );
  });
});
