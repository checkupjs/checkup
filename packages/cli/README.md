# @checkup/cli

A CLI that provides health check information about your project.

![CI Build](https://github.com/checkupjs/checkup/workflows/CI%20Build/badge.svg)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@checkup/cli.svg)](https://npmjs.org/package/@checkup/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@checkup/cli.svg)](https://npmjs.org/package/@checkup/cli)
[![License](https://img.shields.io/npm/l/@checkup/cli.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Configuration](#configuration)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ yarn global add @checkup/cli

$ checkup COMMAND
running command...

$ checkup (-v|--version|version)
@checkup/cli/0.0.0 darwin-x64 node-v10.18.0

$ checkup --help [COMMAND]
USAGE
  $ checkup COMMAND
...
```

<!-- usagestop -->

# Configuration

<!-- configuration -->

checkup is designed to be completely configurable via a configuration object.

checkup uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find and load your configuration object. Starting from the current working directory, it looks for the following possible sources:
                                        
- a checkup property in package.json
- a .checkuprc file
- a checkup.config.js file exporting a JS object

The search stops when one of these is found, and checkup uses that object. 

The .checkuprc file (without extension) can be in JSON or YAML format. You can add a filename extension to help your text editor provide syntax checking and highlighting:

- checkup.json
- checkup.yaml / .checkup.yml
- checkup.js

The configuration object has the following properties:

## plugins

checkup supports the use of plugins. Before using the plugin, you have to install it using npm/yarn.

```sh-session
$ yarn add -D @checkup/plugin-ember
```

To configure plugins, use the plugins key in your configuration file, which contains a list of plugin names.
```json
{
  "plugins": [
    "@checkup/plugin-ember"
  ]
}
```
<!-- TODO: Describe properties in CheckupConfig -->

<!-- configurationstop -->

# Commands

<!-- commands -->

<!-- commandsstop -->
