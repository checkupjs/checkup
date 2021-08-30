import * as React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { List } from '../src/components/utils/list';

describe('Test list component', () => {
  it('can generate list component', async () => {
    const data = ['item1', 'item2', 'item3'];
    const { stdout } = render(
      <List>
        {data.map((item) => {
          return <Text key={item}>{item}</Text>;
        })}
      </List>
    );
    expect(stdout.lastFrame()).toMatchInlineSnapshot(`
      "item1
      item2
      item3"
    `);
  });
});
