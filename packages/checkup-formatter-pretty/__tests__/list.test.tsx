import * as React from 'react';
// eslint-disable-next-line node/no-unpublished-import
import { render } from 'ink-testing-library';
import { List } from '../src/components/list';

describe('Test list component', () => {
  it('can generate list component', async () => {
    const { stdout } = render(<List data="hello" />);
    expect(stdout.lastFrame()).toMatchInlineSnapshot(`"I am a list hello"`);
  });
});
