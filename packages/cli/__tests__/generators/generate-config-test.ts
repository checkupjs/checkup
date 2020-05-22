import * as fs from 'fs';
import * as helpers from 'yeoman-test';
import * as path from 'path';

import ConfigGenerator from '../../src/generators/config';
import { testRoot } from '@checkup/test-helpers';

describe('config-init-generator', () => {
  it('should write a config given default answers', async () => {
    const directory = await helpers.run(ConfigGenerator);

    expect(testRoot(directory).file('.checkuprc').contents).toMatchSnapshot();
  });

  it('should error if a checkuprc file is already present', async () => {
    await expect(
      helpers.run(ConfigGenerator).inTmpDir(function (dir) {
        fs.writeFileSync(path.join(dir, '.checkuprc'), JSON.stringify({}));
      })
    ).rejects.toThrow();
  });
});
