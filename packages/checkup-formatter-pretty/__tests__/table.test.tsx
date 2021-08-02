import * as React from 'react';
// eslint-disable-next-line node/no-unpublished-import
import { render } from 'ink-testing-library';
import { Table } from '../src/components/table';

describe('Test table component', () => {
  it('can generate table component', async () => {
    const { stdout } = render(<Table data="hello" />);
    expect(stdout.lastFrame()).toMatchInlineSnapshot(`"I am a table hello"`);
  });
});
