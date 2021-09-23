import * as React from 'react';
import { render } from 'ink-testing-library';
import { NoResultsFound } from '../../src/sub-components/no-results-found';

const stripAnsi = require('strip-ansi');

describe('Test Bar component', () => {
  it('can generate bar component', async () => {
    const { lastFrame } = render(<NoResultsFound />);

    expect(stripAnsi(lastFrame()!)).toMatchInlineSnapshot(`"No results found."`);
  });
});
