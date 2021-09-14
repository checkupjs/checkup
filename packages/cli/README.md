# @checkup/cli

A CLI that provides health check information about your project.

![CI Build](https://github.com/checkupjs/checkup/workflows/CI%20Build/badge.svg)
[![Version](https://img.shields.io/npm/v/@checkup/cli.svg)](https://npmjs.org/package/@checkup/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@checkup/cli.svg)](https://npmjs.org/package/@checkup/cli)
[![License](https://img.shields.io/npm/l/@checkup/cli.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)

# Usage

Install checkup CLI globally:

Using `yarn`:

```sh-session
$ yarn global add @checkup/cli
```

Using `npm`:

```sh-session
$ npm install -g @checkup/cli
```

Using `volta`:

```sh-session
$ volta install @checkup/cli
```

## Configuration

First use the config generator to create a config file in your project's directory:

```sh-session
$ checkup generate config
```

The `checkup` CLI is now available to run. Use the `run` command to run Checkup against your project directory:

```sh-session
$ checkup run .
```

Checkup is designed to be completely configurable via a configuration object.

You can also specify an explicit path to a configuration via the command line, which will override any configurations found in any `.checkuprc.*` files

```sh-session
$ checkup --config /some/path/to/my/config/.checkuprc
```

The configuration object has the following properties:

### Plugins

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

### Tasks

Tasks are the core primitive that Checkup uses to gather data for the Checkup report.

To generate a task, run the following in the plugin directory you want to add the task to:

```shell
$ checkup generate task example-task
```

## Checkup Command (alias `checkup run`)

### `checkup run PATH`

A CLI that provides health check information about your project

```shell
checkup run [paths..] [options]

Options:
      --help             Show help                                        [boolean]
      --version          Show version number                              [boolean]
  -e, --exclude-paths    Paths to exclude from checkup. If paths are provided via
                         command line and via checkup config, command line paths
                         will be used.                                      [array]
  -c, --config-path      Use the configuration found at this path, overriding
                         .checkuprc if present.             [default: ".checkuprc"]
      --config           Use this configuration, overriding .checkuprc if present.
  -d, --cwd              The path referring to the root directory that Checkup will
                         run in                                [default: (default)]
      --category         Runs specific tasks specified by category. Can be used
                         multiple times.                                    [array]
      --group            Runs specific tasks specified by group. Can be used
                         multiple times.                                    [array]
  -t, --task             Runs specific tasks specified by the fully qualified task
                         name in the format pluginName/taskName. Can be used
                         multiple times.                                    [array]
  -f, --format           Use a specific output format          [default: "summary"]
  -o, --output-file      Specify file to write JSON output to.        [default: ""]
  -l, --list-tasks       List all available tasks to run.                 [boolean]
  -p, --plugin-base-dir  The base directory where Checkup will load the plugins
                         from. Defaults to cwd.
```

_See code: [src/commands/run.ts](https://github.com/checkupjs/checkup/blob/v0.0.0/src/commands/run.ts)_

## Generate Command

Checkup comes with a few generators to help generate Checkup plugins and tasks.

### `checkup generate plugin PLUGIN_NAME PATH`

Generate a checkup `plugin`.

```sh-session
checkup generate plugin <name> [options]

Generates a checkup plugin project

Positionals:
  name  Name of the plugin (eg. checkup-plugin-myplugin)   [required] [default: ""]

Options:
      --help      Show help                                               [boolean]
      --version   Show version number                                     [boolean]
  -d, --defaults  Use defaults for every setting                          [boolean]
  -p, --path      The path referring to the directory that the generator will run
                  in                                                 [default: "."]
```

### `checkup generate task TASK_NAME PATH`

Generate a `task` within a Checkup `plugin`.

```sh-session
checkup generate task <name> [options]

Generates a checkup task within a project

Positionals:
  name  Name of the task (foo-task)                        [required] [default: ""]

Options:
      --help      Show help                                               [boolean]
      --version   Show version number                                     [boolean]
  -d, --defaults  Use defaults for every setting                          [boolean]
  -p, --path      The path referring to the directory that the generator will run
                  in                                                 [default: "."]
```

### `checkup generate actions ACTION_NAME PATH`

Generate a task actions within a Checkup `plugin`.

```sh-session
checkup generate actions <name> [options]

Generates checkup actions within a project

Positionals:
  name  Name of the actions (foo-task-actions)             [required] [default: ""]

Options:
      --help      Show help                                               [boolean]
      --version   Show version number                                     [boolean]
  -d, --defaults  Use defaults for every setting                          [boolean]
  -p, --path      The path referring to the directory that the generator will run
                  in                                                 [default: "."]
```

_See code: [src/commands/generate.ts](https://github.com/checkupjs/checkup/blob/v0.0.0/src/commands/generate.ts)_
