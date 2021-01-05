import { CLIEngine } from 'eslint';
import { resolve } from 'path';
import { createParser, ESLintParser } from '../../src/parsers/eslint-parser';
import { ESLintOptions } from '../../src/types/parsers';

const SIMPLE_FILE_PATH = resolve('..', '__fixtures__/simple.js');

describe('eslint-parser', () => {
  it('can create an eslint parser', () => {
    let config: ESLintOptions = {
      parser: 'babel-eslint',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          legacyDecorators: true,
        },
      },
      envs: ['browser'],
    };

    let parser: ESLintParser = createParser(config) as ESLintParser;
    let configForFile = parser.engine.getConfigForFile(SIMPLE_FILE_PATH);

    expect(parser.engine).toBeInstanceOf(CLIEngine);
    expect(Object.keys(configForFile)).toMatchInlineSnapshot(`
      Array [
        "env",
        "globals",
        "noInlineConfig",
        "parser",
        "parserOptions",
        "plugins",
        "reportUnusedDisableDirectives",
        "rules",
        "settings",
        "ignorePatterns",
      ]
    `);
  });

  it('can create an eslint parser with custom rule configuration', () => {
    let config: ESLintOptions = {
      parser: 'babel-eslint',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          legacyDecorators: true,
        },
      },
      envs: ['browser'],
      rules: {
        'no-tabs': [
          'error',
          {
            allowIndentationTabs: true,
          },
        ],
      },
    };

    let parser: ESLintParser = createParser(config) as ESLintParser;
    let configForFile = parser.engine.getConfigForFile(SIMPLE_FILE_PATH);

    expect(parser.engine).toBeInstanceOf(CLIEngine);
    expect(configForFile.rules!['no-tabs']).toMatchInlineSnapshot(`
      Array [
        "error",
        Object {
          "allowIndentationTabs": true,
        },
      ]
    `);
  });
});
