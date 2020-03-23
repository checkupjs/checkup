# @checkup/cli

A CLI that provides health check information about your project.

![CI Build](https://github.com/checkupjs/checkup/workflows/CI%20Build/badge.svg)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@checkup/cli.svg)](https://npmjs.org/package/@checkup/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@checkup/cli.svg)](https://npmjs.org/package/@checkup/cli)
[![License](https://img.shields.io/npm/l/@checkup/cli.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)

- [@checkup/cli](#checkupcli)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [Commands](#commands)

# Usage

Install checkup CLI globally:

```sh-session
$ yarn global add @checkup/cli

# or

$ npm install -g @checkup/cli
```

The `checkup` CLI is now available to run. Use the `run` command to run
Checkup against your project directory:

```sh-session
$ checkup run .
Checking up on your project...
```

# Run Command

## `checkup run PATH`

A CLI that provides health check information about your project

```
USAGE
  $ checkup run PATH

ARGUMENTS
  PATH  [default: .] The path referring to the root directory that Checkup will run in

OPTIONS
  -c, --config=config                      Use this configuration, overriding .checkuprc.* if present
  -f, --force
  -h, --help                               show CLI help
  -o, --reportOutputPath=reportOutputPath  [default: .]
  -r, --reporter=stdout|json|pdf           [default: stdout]
  -s, --silent
  -t, --task=task
  -v, --version                            show CLI version
```

_See code: [src/commands/run.ts](https://github.com/checkupjs/checkup/blob/v0.0.0/src/commands/run.ts)_

# Generate Command

Checkup comes with a few generators to help generate Checkup plugins and tasks.

## `checkup generate plugin PLUGIN_NAME PATH`

Generate a checkup plugin.

```
USAGE
  $ checkup generate plugin PLUGIN_NAME PATH

ARGUMENTS
  NAME  name of the plugin (kebab-case)
  PATH  [default: .] The path referring to the directory that the generator will run in

OPTIONS
  --defaults         use defaults for every setting
  --force            overwrite existing files
  --options=options  (typescript)
```

## `checkup generate task TASK_NAME PATH`

Generate a task within a Checkup plugin.

```
USAGE
  $ checkup generate task TASK_NAME PATH

ARGUMENTS
  NAME  name of the task (kebab-case)
  PATH  [default: .] The path referring to the directory that the generator will run in

OPTIONS
  --defaults         use defaults for every setting
  --force            overwrite existing files
  --options=options  (typescript)
```

_See code: [src/commands/generate.ts](https://github.com/checkupjs/checkup/blob/v0.0.0/src/commands/generate.ts)_

# Configuration

<!-- configuration -->

Checkup is designed to be completely configurable via a configuration object.

Checkup uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find and load your configuration object. Starting from the current working directory, it looks for the following possible sources:

- a .checkuprc file
- a checkup.config.js file exporting a JS object

The search stops when one of these is found, and Checkup uses that object.

The .checkuprc file (without extension) can be in JSON or YAML format. You can add a filename extension to help your text editor provide syntax checking and highlighting:

- .checkup.json
- .checkup.yaml / .checkup.yml
- .checkup.js

You can also specify an explicit path to a configuration via the command line, which will override any configurations found in any `.checkuprc.*` files

```sh-session
$ checkup --config /some/path/to/my/config/.checkuprc
```

The configuration object has the following properties:

## Plugins

Checkup supports the use of plugins. Before using the plugin, you have to install it using npm/yarn.

```sh-session
$ yarn add -D @checkup/plugin-ember
```

To configure plugins, use the plugins key in your configuration file, which contains a list of plugin names.

```json
{
  "plugins": ["@checkup/plugin-ember"]
}
```

<!-- TODO: Describe properties in CheckupConfig -->

<!-- configurationstop -->
