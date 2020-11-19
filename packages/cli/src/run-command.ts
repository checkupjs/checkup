import * as Config from '@oclif/config';

const castArray = <T>(input?: T | T[]): T[] => {
  if (input === undefined) return [];
  return Array.isArray(input) ? input : [input];
};

let root = require.resolve('.');

export async function runCommand(args: string[] | string, opts: loadConfig.Options = {}) {
  // Used to signal to the oclif commands that we're invoking in
  // CLI mode - prevents any stdout when invoking Checkup programmatically
  process.env.CHECKUP_CLI = '1';

  let config = await Config.load(opts.root || root);

  args = castArray(args);

  const [id, ...extra] = args;
  await config.runHook('init', { id, argv: extra });
  await config.runCommand(id, extra);

  return;
}

export namespace loadConfig {
  export let root: string;
  export interface Options {
    root?: string;
    reset?: boolean;
    testing?: boolean;
  }
}
