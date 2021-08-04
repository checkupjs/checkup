import * as React from 'react';
import { render } from 'ink-testing-library';
import { ListItem } from '../src/components/list-item';

describe('Test list-item component', () => {
  it('can generate list-item component', async () => {
    const { lastFrame } = render(<ListItem data="list 1"></ListItem>);
    expect(lastFrame()).toMatchInlineSnapshot(`"list 1"`);
  });
});
