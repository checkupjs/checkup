# checkup-plugin-ember

A checkup plugin for Ember project tasks

![CI Build](https://github.com/checkupjs/checkup/workflows/CI%20Build/badge.svg)
[![Version](https://img.shields.io/npm/v/checkup-plugin-ember.svg)](https://npmjs.org/package/checkup-plugin-ember)
[![Downloads/week](https://img.shields.io/npm/dw/checkup-plugin-ember.svg)](https://npmjs.org/package/checkup-plugin-ember)
[![License](https://img.shields.io/npm/l/checkup-plugin-ember.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)

- [checkup-plugin-ember](#checkup-plugin-ember)
- [Usage](#usage)

## Usage

1. Install [@checkup/cli](https://github.com/checkupjs/checkup/blob/master/packages/cli/README.md) globally following the README.

2. Install `checkup-plugin-ember`

   ```sh-session
   $ npm install --save-dev checkup-plugin-ember

   # or

   $ yarn add --dev checkup-plugin-ember
   ```

3. Add `checkup-plugin-ember` as a plugin to your config.

   ```json
    {
      "plugins": [
        ...
        "checkup-plugin-ember"
        ...
      ],
      "tasks": {
        ...
      }
    }
   ```

4. Run checkup.

   ```sh-session
   $ checkup
   ```
