import { basename, extname, join } from 'path';

import { run as oclifRun } from '@oclif/command';
import { readdirSync } from 'fs';

const DEFAULT_COMMAND = 'run';
const COMMANDS = new Set(
  readdirSync(join(__dirname, 'commands')).map((filename: string) =>
    basename(filename, extname(filename))
  )
);

export function run() {
  let args = process.argv.slice(2);
  let maybeCommand = args[0];

  // if the args don't contain a known command, we default to the `run` command
  if (!COMMANDS.has(maybeCommand)) {
    args.unshift(DEFAULT_COMMAND);
  }

  // Used to signal to the oclif commands that we're invoking in
  // CLI mode - prevents any stdout when invoking Checkup programmatically
  process.env.CHECKUP_CLI = '1';

  return oclifRun(args);
}

export { runCommand } from './run-command';

export { default as Checkup } from './commands/run';
