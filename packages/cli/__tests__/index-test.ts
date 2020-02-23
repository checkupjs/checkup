import { stdout } from '@checkup/test-helpers';

import cmd = require('../src');

describe('@checkup/cli', () => {
  it('should output checkup result', async () => {
    await cmd.run([]);

    expect(stdout()).toMatchSnapshot();
  });

  it('should output checkup result in JSON', async () => {
    await cmd.run(['--json']);

    expect(stdout()).toMatchSnapshot();
  });
});
