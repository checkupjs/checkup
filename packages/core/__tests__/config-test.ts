import { getConfigPath, readConfig, writeConfig } from '../src/config';
import { readJsonSync, writeJsonSync } from 'fs-extra';

import { DEFAULT_CONFIG } from '../lib';
import { createTmpDir } from '@checkup/test-helpers';

describe('config', () => {
  let tmp: string;

  describe('readConfig', () => {
    beforeEach(() => {
      tmp = createTmpDir();
    });

    it('throws if no checkup config found', () => {
      expect(() => {
        readConfig(tmp);
      }).toThrow(`Could not find a checkup config in the given path: ${tmp}.`);
    });

    it('throws if config format is invalid', () => {
      let configPath = getConfigPath(tmp);
      writeJsonSync(configPath, {
        plugins: [],
        task: {},
      });

      expect(() => {
        readConfig(configPath);
      }).toThrow(`Config in ${configPath} is invalid.`);
    });

    it('throws if invalid paths are passed in via config', () => {
      let configPath = getConfigPath(tmp);
      writeJsonSync(configPath, {
        plugins: [],
        tasks: {},
        excludePaths: 'foo', // excludePaths should be an array
      });

      expect(() => {
        readConfig(configPath);
      }).toThrow(`Config in ${configPath} is invalid.`);
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
      }).toThrow(`There is already an existing config in ${tmp}`);
    });

    it('writes default config if no config is passed', () => {
      let path = writeConfig(tmp);

      expect(readJsonSync(path)).toMatchInlineSnapshot(`
        Object {
          "excludePaths": Array [],
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
          "excludePaths": Array [],
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
