import * as yargs from 'yargs';
import { OutputFormat, ConsoleWriter, CheckupConfig } from '@checkup/core';
import { runCommand } from './commands/run.js';
import { generateCommand } from './commands/generate.js';

interface CheckupArguments {
  [x: string]: unknown;
  paths: string[];
  excludePaths: string[];
  config: CheckupConfig;
  configPath: string;
  cwd: string;
  category: string[];
  group: string[];
  task: string[];
  pluginBaseDir: string;
  listTasks: boolean;
  format: OutputFormat;
  outputFile: string;
}

export type CLIOptions = CheckupArguments & yargs.Arguments;

export const consoleWriter = new ConsoleWriter();
export let parser: yargs.Argv<{}>;

export async function run(argv: string[] = process.argv.slice(2)) {
  parser = yargs
    .scriptName('checkup')
    .usage(
      `
A health checkup for your project ✅

checkup <command> [options]`
    )
    .command(runCommand)
    .command(generateCommand)
    .showHelpOnFail(false)
    .wrap(yargs.terminalWidth())
    .help()
    .version();

  if (argv.length === 0) {
    parser.showHelp();
  } else {
    parser.parse(argv);
  }
}
