import { CLIEngine } from 'eslint';

// These options are taken from a default ember application build on top of ember-source 3.16.*
export function getOctaneESLintEngine(): CLIEngine {
  return new CLIEngine({
    parser: 'babel-eslint',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        legacyDecorators: true,
      },
    },
    plugins: ['ember'],
    envs: ['browser'],
    rules: {
      'ember/classic-decorator-hooks': 'error',
      'ember/classic-decorator-no-classic-methods': 'error',
      'ember/no-actions-hash': 'error',
      'ember/no-classic-classes': 'error',
      'ember/no-classic-components': 'error',
      'ember/no-component-lifecycle-hooks': 'error',
      'ember/no-computed-properties-in-native-classes': 'error',
      'ember/no-get-with-default': 'error',
      'ember/no-get': 'error',
      'ember/no-jquery': 'error',
      'ember/require-tagless-components': 'error',
    },
    useEslintrc: false,
  });
}
