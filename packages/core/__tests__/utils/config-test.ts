import { readConfig, writeConfig } from '../../src/utils/config';

import { DEFAULT_CONFIG } from '../../lib';
import { createTmpDir } from '@checkup/test-helpers';
import { readJsonSync } from 'fs-extra';

describe('config', () => {
  let tmp: string;

  describe('readConfig', () => {
    beforeEach(() => {
      tmp = createTmpDir();
    });

    it('throws if no checkup config found', () => {
      expect(() => {
        readConfig(tmp);
      }).toThrow(`Could not locate a Checkup config in ${tmp}`);
    });

    it('can load a config from an external directory', () => {
      let configPath = writeConfig(tmp);
      let config = readConfig(configPath);

      expect(config).toEqual(DEFAULT_CONFIG);
    });
  });

  describe('writeConfig', () => {
    beforeEach(() => {
      tmp = createTmpDir();
    });

    it('throws if existing .checkuprc file present', () => {
      writeConfig(tmp);

      expect(() => {
        writeConfig(tmp);
      }).toThrow(`There is already an existing Checkup config in ${tmp}`);
    });

    it('writes default config if no config is passed', () => {
      let path = writeConfig(tmp);

      expect(readJsonSync(path)).toMatchInlineSnapshot(`
        Object {
          "plugins": Array [],
          "tasks": Object {},
        }
      `);
    });

    it('writes specific config when config is passed', () => {
      let path = writeConfig(tmp, {
        plugins: ['ember'],
        tasks: {
          'ember/ember-tests-task': 'off',
        },
      });

      expect(readJsonSync(path)).toMatchInlineSnapshot(`
        Object {
          "plugins": Array [
            "ember",
          ],
          "tasks": Object {
            "ember/ember-tests-task": "off",
          },
        }
      `);
    });
  });
});
