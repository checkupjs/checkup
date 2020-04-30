import { ESLintOptions, TemplateLintConfig } from '@checkup/core';

// These options are taken from a default ember application build on top of ember-source 3.16.*
export const OCTANE_ES_LINT_CONFIG: ESLintOptions = {
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
    'ember/no-mixins': 'error',
  },
  useEslintrc: false,
};

export const OCTANE_TEMPLATE_LINT_CONFIG: TemplateLintConfig = {
  rules: {
    'no-action': 'error',
    'no-args-paths': 'error',
    'no-curly-component-invocation': [
      'error',
      {
        noImplicitThis: 'error',
        requireDash: 'off',
      },
    ],
    'no-implicit-this': 'error',
  },
};
