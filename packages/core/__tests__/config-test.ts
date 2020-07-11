import { getConfigPath, readConfig, writeConfig, parseConfigTuple } from '../src/config';
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

    it('throws if config with invalid task config string value set invalid string', () => {
      let configPath = writeConfig(tmp, {
        plugins: ['ember'],
        tasks: {
          //@ts-ignore
          'foo/bar': 'blarg',
        },
      });

      expect(() => {
        readConfig(configPath);
      }).toThrow(`Config in ${configPath} is invalid.`);
    });

    it('can read a valid config with valid task config string value set to "on"', () => {
      let configPath = writeConfig(tmp, {
        plugins: ['ember'],
        tasks: {
          'foo/bar': 'on',
        },
      });

      let config = readConfig(configPath);

      expect(config).toMatchInlineSnapshot(`
        Object {
          "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/config/config-schema.json",
          "excludePaths": Array [],
          "plugins": Array [
            "checkup-plugin-ember",
          ],
          "tasks": Object {
            "foo/bar": "on",
          },
        }
      `);
    });

    it('can read a valid config with valid task config string value set to "off"', () => {
      let configPath = writeConfig(tmp, {
        plugins: ['ember'],
        tasks: {
          'foo/bar': 'off',
        },
      });

      let config = readConfig(configPath);

      expect(config).toMatchInlineSnapshot(`
        Object {
          "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/config/config-schema.json",
          "excludePaths": Array [],
          "plugins": Array [
            "checkup-plugin-ember",
          ],
          "tasks": Object {
            "foo/bar": "off",
          },
        }
      `);
    });

    it('can read a valid config with valid task config tuple value set to ["on", {}]', () => {
      let configPath = writeConfig(tmp, {
        plugins: ['ember'],
        tasks: {
          'foo/bar': ['on', {}],
        },
      });

      let config = readConfig(configPath);

      expect(config).toMatchInlineSnapshot(`
        Object {
          "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/config/config-schema.json",
          "excludePaths": Array [],
          "plugins": Array [
            "checkup-plugin-ember",
          ],
          "tasks": Object {
            "foo/bar": Array [
              "on",
              Object {},
            ],
          },
        }
      `);
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
          "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/config/config-schema.json",
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
          "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/config/config-schema.json",
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

  describe('parseConfigTuple', () => {
    it('returns correct defaults when undefined', () => {
      let config;
      let [enabled, value] = parseConfigTuple(config);

      expect(enabled).toEqual(true);
      expect(value).toEqual({});
    });

    it('returns correct defaults when "on"', () => {
      let [enabled, value] = parseConfigTuple('on');

      expect(enabled).toEqual(true);
      expect(value).toEqual({});
    });

    it('returns correct defaults when "off"', () => {
      let [enabled, value] = parseConfigTuple('off');

      expect(enabled).toEqual(false);
      expect(value).toEqual({});
    });

    it('returns correct defaults when a tuple and "on"', () => {
      let [enabled, value] = parseConfigTuple(['on', { foo: true }]);

      expect(enabled).toEqual(true);
      expect(value).toEqual({ foo: true });
    });

    it('returns correct defaults when a tuple and "off"', () => {
      let [enabled, value] = parseConfigTuple(['off', { foo: true }]);

      expect(enabled).toEqual(false);
      expect(value).toEqual({ foo: true });
    });
  });
});
