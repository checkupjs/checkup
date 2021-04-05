import chalk from 'chalk';

export enum ErrorKind {
  None,

  Unknown,

  ConfigNotValid,
  ConfigInvalidSyntax,
  ConfigInvalidSchema,
  ConfigFileExists,

  TasksNotFound,
  TaskCategoriesNotFound,
  TaskGroupsNotFound,
  TaskConsoleReporterNotFound,
  TaskError,
  TaskCategoryRequired,

  ReporterNotFound,

  GeneratorNotFound,
  GeneratorPluginWorkContextNotValid,
  GeneratorPluginDestinationNotEmpty,
  GeneratorWorkContextNotValid,
}

export interface ErrorDetails {
  message: (options: ErrorDetailOptions) => string;
  callToAction: (options: ErrorDetailOptions) => string;
  errorCode: number;
}

export type ErrorDetailOptions = Record<string, any> & { error?: Error };

export const ERROR_BY_KIND: { [key: string]: ErrorDetails } = {
  [ErrorKind.ConfigNotValid]: {
    message: () => `Configuration not valid`,
    callToAction: () =>
      `Checkup requires a valid config file. Please see https://docs.checkupjs.com/quickstart/usage#1-generate-a-configuration-file`,
    errorCode: 1,
  },

  [ErrorKind.ConfigInvalidSyntax]: {
    message: (options: ErrorDetailOptions) =>
      `The checkup config at ${options.configPath} contains invalid JSON.\nError: ${options.hint}`,
    callToAction: () => 'Fix the syntax error in your .checkuprc before continuing.',
    errorCode: 1,
  },

  [ErrorKind.ConfigInvalidSchema]: {
    message: (options: ErrorDetailOptions) =>
      `Config in ${options.configPath} is invalid.${options.hint}`,
    callToAction: (options: ErrorDetailOptions) =>
      `See ${options.docsUrl} for more information on correct config formats.`,
    errorCode: 1,
  },

  [ErrorKind.ConfigFileExists]: {
    message: () => 'Checkup config file exists in this directory',
    callToAction: (options: ErrorDetailOptions) =>
      `Checkup config file found at ${chalk.bold.white(
        options.configDestination
      )}. You can only generate a ${chalk.bold.white(
        '.checkuprc'
      )} in a directory that doesn't contain one already.`,
    errorCode: 1,
  },

  [ErrorKind.TasksNotFound]: {
    message: (options: ErrorDetailOptions) =>
      `Cannot find the ${options.tasksNotFound.join(',')} task${
        options.tasksNotFound.length > 1 ? 's' : ''
      }.`,
    callToAction: () => 'Run `checkup --listTasks` to see available tasks',
    errorCode: 1,
  },

  [ErrorKind.TaskCategoriesNotFound]: {
    message: (options: ErrorDetailOptions) =>
      `Cannot find any tasks with the following ${
        options.tasksNotFound.length > 1 ? 'category' : 'categories'
      } ${options.tasksNotFound.join(',')}.`,
    callToAction: () => '',
    errorCode: 1,
  },

  [ErrorKind.TaskGroupsNotFound]: {
    message: (options: ErrorDetailOptions) =>
      `Cannot find any tasks with the following ${
        options.tasksNotFound.length > 1 ? 'group' : 'groups'
      } ${options.tasksNotFound.join(',')}.`,
    callToAction: () => '',
    errorCode: 1,
  },

  [ErrorKind.TaskConsoleReporterNotFound]: {
    message: (options: ErrorDetailOptions) =>
      `Unable to find a console reporter for ${options.taskName}`,
    callToAction: () => 'Add a console task reporter in the plugin index file',
    errorCode: 1,
  },

  [ErrorKind.TaskError]: {
    message: (options: ErrorDetailOptions) => `${options.taskName} ran with problems.`,
    callToAction: (options: ErrorDetailOptions) => options.taskErrorMessage,
    errorCode: 1,
  },

  [ErrorKind.TaskCategoryRequired]: {
    message: () => 'Task category cannot be empty.',
    callToAction: (options: ErrorDetailOptions) =>
      `Please add a category to ${options.fullyQualifiedTaskName}-task`,
    errorCode: 1,
  },

  [ErrorKind.ReporterNotFound]: {
    message: (options: ErrorDetailOptions) =>
      `No valid format found for ${chalk.bold.white(options.format)}`,
    callToAction: (options: ErrorDetailOptions) =>
      `Valid formats are ${chalk.bold.white(options.validFormats.join(', '))}`,
    errorCode: 1,
  },

  [ErrorKind.GeneratorNotFound]: {
    message: (options: ErrorDetailOptions) =>
      `No valid generator found for ${chalk.bold.white(options.generator)}`,
    callToAction: (options: ErrorDetailOptions) =>
      `Valid generators are ${chalk.bold.white(options.validGenerators.join(', '))}`,
    errorCode: 1,
  },

  [ErrorKind.GeneratorPluginWorkContextNotValid]: {
    message: () => `Can only generate plugins outside a Checkup plugin directory`,
    callToAction: () =>
      `Run ${chalk.bold.white('checkup generate plugin')} from outside a Checkup plugin`,
    errorCode: 1,
  },

  [ErrorKind.GeneratorPluginDestinationNotEmpty]: {
    message: (options: ErrorDetailOptions) =>
      `Plugin destination ${chalk.bold.white(options.destinationPath)} is not empty`,
    callToAction: () => `Run ${chalk.bold.white('checkup generate plugin')} in an empty directory`,
    errorCode: 1,
  },

  [ErrorKind.GeneratorWorkContextNotValid]: {
    message: (options: ErrorDetailOptions) =>
      `Can only generate ${options.type} from inside a Checkup plugin directory`,
    callToAction: (options: ErrorDetailOptions) =>
      `Run ${chalk.bold.white(
        `checkup generate ${options.type}`
      )} from the root of a Checkup plugin or use the ${chalk.bold.white(
        '--path'
      )} option to specify the path to a Checkup plugin`,
    errorCode: 1,
  },

  [ErrorKind.Unknown]: {
    message: () => 'An unknown error has occurred.',
    callToAction: () => '',
    errorCode: 1,
  },
};
