import { resolve } from 'path';
import { ESLint } from 'eslint';
import ESLintAnalyzer from '../../src/analyzers/eslint-analyzer';

const SIMPLE_FILE_PATH = resolve('..', '__fixtures__/simple.js');

describe('eslint-analyzer', () => {
  it('can create an eslint analyzer', async () => {
    let options: ESLint.Options = {
      baseConfig: {
        parser: '@babel/eslint-parser',
        parserOptions: {
          ecmaVersion: 2018,
          sourceType: 'module',
          ecmaFeatures: {
            legacyDecorators: true,
          },
          requireConfigFile: false,
        },
        env: {
          browser: true,
        },
      },
    };

    let analyzer: ESLintAnalyzer = new ESLintAnalyzer(options);
    let configForFile = await analyzer.engine.calculateConfigForFile(SIMPLE_FILE_PATH);

    expect(analyzer.engine).toBeInstanceOf(ESLint);
    expect(Object.keys(configForFile)).toMatchInlineSnapshot(`
[
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

  it('can create an eslint analyzer with custom rule configuration', async () => {
    let options: ESLint.Options = {
      baseConfig: {
        parser: '@babel/eslint-parser',
        parserOptions: {
          ecmaVersion: 2018,
          sourceType: 'module',
          ecmaFeatures: {
            legacyDecorators: true,
          },
          requireConfigFile: false,
        },
        env: { browser: true },
        rules: {
          'no-tabs': [
            'error',
            {
              allowIndentationTabs: true,
            },
          ],
        },
      },
    };

    let analyzer: ESLintAnalyzer = new ESLintAnalyzer(options);
    let configForFile = await analyzer.engine.calculateConfigForFile(SIMPLE_FILE_PATH);

    expect(analyzer.engine).toBeInstanceOf(ESLint);
    expect(configForFile.rules!['no-tabs']).toMatchInlineSnapshot(`
[
  0,
  {
    "allowIndentationTabs": true,
  },
]
`);
  });
});
