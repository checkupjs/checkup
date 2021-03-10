import * as helpers from 'yeoman-test';

import { createTmpDir, testRoot } from '@checkup/test-helpers';

import ConfigGenerator from '../../src/generators/config';
import { join } from 'path';
import { writeFileSync } from 'fs';

describe('config-init-generator', () => {
  it('should write a config', async () => {
    let tmp = createTmpDir();

    const dir = await helpers.run(ConfigGenerator).cd(tmp).withOptions({ path: tmp });

    expect(testRoot(dir).file('.checkuprc').contents).toMatchSnapshot();
  });

  it('should write a config in custom path', async () => {
    let tmp = createTmpDir();

    const dir = await helpers.run(ConfigGenerator).cd(tmp).withOptions({ path: './lib' });

    expect(testRoot(join(dir, 'lib')).file('.checkuprc').contents).toMatchSnapshot();
  });

  it('should error if a checkuprc file is already present', async () => {
    let tmp = createTmpDir();

    await expect(
      helpers
        .run(ConfigGenerator)
        .withOptions({ path: tmp })
        .inTmpDir(function (dir) {
          writeFileSync(join(dir, '.checkuprc'), JSON.stringify({}));
        })
    ).rejects.toThrow();
  });
});
