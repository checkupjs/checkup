import { expect, test } from '@oclif/test';

import cmd = require('../src');

describe('@checkup/cli', () => {
  test
    .stdout()
    .do(() => cmd.run([]))
    .it('runs checkup command', ctx => {
      expect(ctx.stdout).to.contain('Checkup run');
    });
});
