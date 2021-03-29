# checkup-plugin-javascript

A checkup plugin for Javascript project tasks

![CI Build](https://github.com/checkupjs/checkup/workflows/CI%20Build/badge.svg)
[![Version](https://img.shields.io/npm/v/checkup-plugin-javascript.svg)](https://npmjs.org/package/checkup-plugin-javascript)
[![Downloads/week](https://img.shields.io/npm/dw/checkup-plugin-javascript.svg)](https://npmjs.org/package/checkup-plugin-javascript)
[![License](https://img.shields.io/npm/l/checkup-plugin-javascript.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)

- [Usage](#usage)

## Usage

1. Install [@checkup/cli](https://github.com/checkupjs/checkup/blob/master/packages/cli/README.md) globally following the README.

2. Install `checkup-plugin-javascript`

   ```sh-session
   $ npm install --save-dev checkup-plugin-javascript

   # or

   $ yarn add --dev checkup-plugin-javascript
   ```

3. Add `checkup-plugin-javascript` as a plugin to your config.

   ```json
    {
      "plugins": [
        ...
        "checkup-plugin-javascript"
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
