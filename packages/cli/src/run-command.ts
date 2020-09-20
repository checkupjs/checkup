import * as Config from '@oclif/config';
import * as stdout from 'stdout-monkey';
const stripAnsi = require('strip-ansi');

const castArray = <T>(input?: T | T[]): T[] => {
  if (input === undefined) return [];
  return Array.isArray(input) ? input : [input];
};

let root = require.resolve('.');

export async function runCommand(args: string[] | string, opts: loadConfig.Options = {}) {
  let output: string;
  let patch;

  if (!opts.testing) {
    patch = stdout((str: string) => {
      output = stripAnsi(str);
    });
  }

  let config = await Config.load(opts.root || root);

  args = castArray(args);

  const [id, ...extra] = args;
  await config.runHook('init', { id, argv: extra });
  await config.runCommand(id, extra);

  if (!opts.testing) {
    patch.restore();

    return { stdout: output! };
  }

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
