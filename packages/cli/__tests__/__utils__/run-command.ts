import * as Config from '@oclif/config';

const castArray = <T>(input?: T | T[]): T[] => {
  if (input === undefined) return [];
  return Array.isArray(input) ? input : [input];
};

let root = require.resolve('../../src');

export async function runCommand(args: string[] | string, opts: loadConfig.Options = {}) {
  let config = await Config.load(opts.root || root);

  args = castArray(args);

  const [id, ...extra] = args;
  await config.runHook('init', { id, argv: extra });
  await config.runCommand(id, extra);
}

export namespace loadConfig {
  export let root: string;
  export interface Options {
    root?: string;
    reset?: boolean;
  }
}
