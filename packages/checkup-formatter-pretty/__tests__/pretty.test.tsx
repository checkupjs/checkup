import * as React from 'react';
// eslint-disable-next-line node/no-unpublished-import
import { render } from 'ink-testing-library';

import Pretty from '../src/pretty';

describe('Test Pretty component', () => {
  it('can generate Pretty component', async () => {
    const { stdout } = render(<Pretty data={['listItem']} />);
    expect(stdout.lastFrame()).toMatchInlineSnapshot(`"hello"`);
  });
});
