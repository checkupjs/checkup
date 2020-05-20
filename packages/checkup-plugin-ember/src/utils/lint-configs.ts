import { ESLintOptions } from '@checkup/core';
import * as path from 'path';

// These options are taken from a default ember application build on top of ember-source 3.16.*
export const EMBER_TEST_TYPES: ESLintOptions = {
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
    'test-types': 'error',
  },
  rulePaths: [path.join(__dirname, '../eslint/rules')],
  useEslintrc: false,
};
