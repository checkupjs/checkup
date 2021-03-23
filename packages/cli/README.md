# @checkup/cli

A CLI that provides health check information about your project.

![CI Build](https://github.com/checkupjs/checkup/workflows/CI%20Build/badge.svg)
[![Version](https://img.shields.io/npm/v/@checkup/cli.svg)](https://npmjs.org/package/@checkup/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@checkup/cli.svg)](https://npmjs.org/package/@checkup/cli)
[![License](https://img.shields.io/npm/l/@checkup/cli.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)

- [@checkup/cli](#checkupcli)
- [Usage](#usage)
- [Checkup Command (alias `checkup run`)](#checkup-command-alias-checkup-run)
  - [`checkup PATH`](#checkup-path)
- [Generate Command](#generate-command)
  - [`checkup generate plugin PLUGIN_NAME PATH`](#checkup-generate-plugin-pluginname-path)
  - [`checkup generate task TASK_NAME PATH`](#checkup-generate-task-taskname-path)
- [Configuration](#configuration)
  - [Plugins](#plugins)
  - [Tasks](#tasks)

# Usage

Install checkup CLI globally:

```sh-session
$ yarn global add @checkup/cli

# or

$ npm install -g @checkup/cli
```

First use the config generator to create a config file in your project's directory:

```sh-session
$ checkup generate config
```

The `checkup` CLI is now available to run. Use the `run` command to run Checkup against your project directory:

```sh-session
$ checkup
Checking up on your project...
```

# Checkup Command (alias `checkup run`)

## `checkup PATH`

A CLI that provides health check information about your project

```shell
A health checkup for your project

USAGE
  $ checkup [run] PATHS

ARGUMENTS
  PATHS  The paths that checkup will operate on. If no paths are provided, checkup will run on the entire directory beginning
         at --cwd.

OPTIONS
  -c, --config=config                Use this configuration, overriding .checkuprc.* if present.

  -d, --cwd=cwd                      [default: '.'] The path referring to the root
                                     directory that Checkup will run in

  -e, --exclude-paths=exclude-paths  Paths to exclude from checkup. If paths are provided via command line and via checkup
                                     config, command line paths will be used.

  -f, --format=stdout|json           [default: stdout] The output format, one of stdout, json

  -h, --help                         show CLI help

  -l, --list-tasks                   List all available tasks to run.

  -o, --output-file=output-file      Specify file to write JSON output to. Requires the `--format` flag to be set to `json`

  -t, --task=task                    Runs specific tasks specified by the fully qualified task name in the format
                                     pluginName/taskName. Can be used multiple times.

  -v, --version                      show CLI version

  --category=category                Runs specific tasks specified by category. Can be used multiple times.

  --group=group                      Runs specific tasks specified by group. Can be used multiple times.

  --verbose
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

Checkup is designed to be completely configurable via a configuration object.

Checkup uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find and load your configuration object. Starting from the current working directory, it looks for the following possible sources:

- a .checkuprc file
- a checkup.config.js file exporting a JS object

The search stops when one of these is found, and Checkup uses that object.

The .checkuprc file (without extension) can be in JSON or JavaScript format. You can add a filename extension to help your text editor provide syntax checking and highlighting:

- .checkup.json
- .checkup.js

You can also specify an explicit path to a configuration via the command line, which will override any configurations found in any `.checkuprc.*` files

```sh-session
$ checkup --config /some/path/to/my/config/.checkuprc
```

The configuration object has the following properties:

## Plugins

Plugins are collections of Checkup tasks that are intended to be configured and run. Conceptually, they're very similar to eslint plugins, which themselves contain a collection of eslint rules to run.

Check out some existing plugins:

- [checkup-plugin-javascript](https://www.npmjs.com/package/checkup-plugin-javascript)
- [checkup-plugin-ember](https://www.npmjs.com/package/checkup-plugin-ember)

Plugins can be authored by anyone, and configured to run for any codebase. Checkup comes with a plugin generator, making it easy to generate the scaffolding needed.

To generate a plugin, run:

```shell
$ checkup generate plugin checkup-plugin-foo
```

To configure plugins, use the plugins key in your configuration file, which contains a list of plugin names.

```json
{
  "plugins": ["checkup-plugin-foo"]
}
```

## Tasks

Tasks are the core primitive that Checkup uses to gather data for the Checkup report.

To generate a task, run the following in the plugin directory you want to add the task to:

```shell
$ checkup generate task example-task
```
