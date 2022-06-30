import * as React from 'react';
import { render } from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import { SectionedBar } from '../../src/components/SectionedBar';
import { BarData } from '../../src/types';

describe('SectionedBar', () => {
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
