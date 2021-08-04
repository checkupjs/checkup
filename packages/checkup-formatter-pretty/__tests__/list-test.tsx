import * as React from 'react';
import { render } from 'ink-testing-library';
import { ListItem } from '../src/components/list-item';
import { List } from '../src/components/list';

describe('Test list component', () => {
  it('can generate list component', async () => {
    const { stdout } = render(
      <List>
        <ListItem data="list 1"></ListItem>
        <ListItem data="list 2"></ListItem>
        <ListItem data="list 3"></ListItem>
      </List>
    );
    expect(stdout.lastFrame()).toMatchInlineSnapshot(`
      "list 1
      list 2
      list 3"
    `);
  });
});
