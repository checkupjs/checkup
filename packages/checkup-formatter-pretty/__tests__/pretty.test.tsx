import * as React from 'react';
// eslint-disable-next-line node/no-unpublished-import
import { render } from 'ink-testing-library';

import Pretty from '../src/pretty';

describe('dependencies-task', () => {
  it('can generate tsx', async () => {
    const { stdout } = render(<Pretty data={['table', 'list']} />);
    expect(stdout.lastFrame()).toMatchInlineSnapshot(`"I am a table helloI am a list hello"`);
  });
});
