# checkup-plugin-ember-octane

A plugin for CheckupJS that tracks progress of Ember Octane migration tasks.

![CI Build](https://github.com/checkupjs/checkup/workflows/CI%20Build/badge.svg)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/checkup-plugin-ember-octane.svg)](https://npmjs.org/package/checkup-plugin-ember-octane)
[![Downloads/week](https://img.shields.io/npm/dw/checkup-plugin-ember-octane.svg)](https://npmjs.org/package/checkup-plugin-ember-octane)
[![License](https://img.shields.io/npm/l/checkup-plugin-ember-octane.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)

- [Usage](#usage)

# Usage

1. Install [@checkup/cli](https://github.com/checkupjs/checkup/blob/master/packages/cli/README.md) globally following the README.

2. Install `checkup-plugin-ember-octane`

   ```sh-session
   $ npm install --save-dev checkup-plugin-ember-octane

   # or

   $ yarn add --dev checkup-plugin-ember-octane
   ```

3. Add `checkup-plugin-ember-octane` as a plugin to your config.

   ```json
    {
      "plugins": [
        ...
        "checkup-plugin-ember-octane"
        ...
      ],
      "tasks": {
        ...
      }
    }
   ```

4. Run checkup.

   ```sh-session
   $ checkup run .
   ```
