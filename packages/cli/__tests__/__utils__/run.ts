import * as execa from 'execa';

export function run(args: string[] = [], options: execa.Options = {}) {
  options = Object.assign(
    {
      reject: false,
    },
    options
  );
  return execa(process.execPath, [require.resolve('../../bin/run'), ...args], options);
}
