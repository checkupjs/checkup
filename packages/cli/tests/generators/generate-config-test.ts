import { join } from 'path';
import { writeFileSync } from 'fs';
import * as helpers from 'yeoman-test';

import { createTmpDir, testRoot } from '@checkup/test-helpers';

import ConfigGenerator from '../../src/generators/config';

describe('config-init-generator', () => {
  it('should write a config', async () => {
    let tmp = createTmpDir();

    const dir = await helpers.run(ConfigGenerator).cd(tmp).withOptions({ path: tmp });

    expect(testRoot(dir.cwd).file('.checkuprc').contents).toMatchInlineSnapshot(`
      "{
        \\"$schema\\": \\"https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json\\",
        \\"excludePaths\\": [],
        \\"plugins\\": [],
        \\"tasks\\": {}
      }
      "
    `);
  });

  it('should write a config in custom path', async () => {
    let tmp = createTmpDir();

    const dir = await helpers.run(ConfigGenerator).cd(tmp).withOptions({ path: './lib' });

    expect(testRoot(join(dir.cwd, 'lib')).file('.checkuprc').contents).toMatchInlineSnapshot(`
      "{
        \\"$schema\\": \\"https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json\\",
        \\"excludePaths\\": [],
        \\"plugins\\": [],
        \\"tasks\\": {}
      }
      "
    `);
  });

  it('should error if a checkuprc file is already present', async () => {
    let tmp = createTmpDir();

    writeFileSync(join(tmp, '.checkuprc'), JSON.stringify({}));

    await expect(helpers.run(ConfigGenerator).withOptions({ path: tmp })).rejects.toThrow();
  });
});
