import * as React from 'react';
import { render } from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import { NoResults } from '../../src/sub-components/NoResults';

describe('Test Bar component', () => {
  it('can generate bar component', async () => {
    const { lastFrame } = render(<NoResults />);

    expect(stripAnsi(lastFrame()!)).toMatchInlineSnapshot(`"No results found."`);
  });
});
