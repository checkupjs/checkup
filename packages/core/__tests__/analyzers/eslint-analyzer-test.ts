import { resolve } from 'path';
import { CLIEngine } from 'eslint';
import ESLintAnalyzer from '../../src/analyzers/eslint-analyzer';
import { ESLintOptions } from '../../src/types/analyzers';

const SIMPLE_FILE_PATH = resolve('..', '__fixtures__/simple.js');

describe('eslint-analyzer', () => {
  it('can create an eslint analyzer', () => {
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

    let analyzer: ESLintAnalyzer = new ESLintAnalyzer(config);
    let configForFile = analyzer.engine.getConfigForFile(SIMPLE_FILE_PATH);

    expect(analyzer.engine).toBeInstanceOf(CLIEngine);
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

  it('can create an eslint analyzer with custom rule configuration', () => {
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

    let analyzer: ESLintAnalyzer = new ESLintAnalyzer(config);
    let configForFile = analyzer.engine.getConfigForFile(SIMPLE_FILE_PATH);

    expect(analyzer.engine).toBeInstanceOf(CLIEngine);
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
