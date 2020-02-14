import { stdout } from './__utils__/stdout';

import cmd = require('../src');

describe('@checkup/cli', () => {
  it('should output checkup result', async () => {
    await cmd.run([]);

    expect(stdout()).toMatchSnapshot();
  });
});
