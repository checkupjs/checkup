import * as helpers from 'yeoman-test';

import { createTmpDir, testRoot } from '@checkup/test-helpers';

import ConfigGenerator from '../../src/generators/config';
import { join } from 'path';
import { writeFileSync } from 'fs';

describe('config-init-generator', () => {
  it('should write a config', async () => {
    let tmp = createTmpDir();

    const dir = await helpers.run(ConfigGenerator).cd(tmp);

    expect(testRoot(dir).file('.checkuprc').contents).toMatchSnapshot();
  });

  it('should error if a checkuprc file is already present', async () => {
    await expect(
      helpers.run(ConfigGenerator).inTmpDir(function (dir) {
        writeFileSync(join(dir, '.checkuprc'), JSON.stringify({}));
      })
    ).rejects.toThrow();
  });
});
