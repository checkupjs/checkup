import * as React from 'react';
import { render } from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import { NoResultsFound } from '../../src/sub-components/no-results-found';

describe('Test Bar component', () => {
  it('can generate bar component', async () => {
    const { lastFrame } = render(<NoResultsFound />);

    expect(stripAnsi(lastFrame()!)).toMatchInlineSnapshot(`"No results found."`);
  });
});
