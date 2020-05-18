const util = require('util');
const execAsPromise = util.promisify(require('child_process').exec);

/**
 * @param cmd
 * @param options
 * @param defaultValue
 * @param toType
 */
export async function exec(
  cmd: string,
  options: any,
  defaultValue: string | number,
  toType: Function = String
) {
  const { stdout } = await execAsPromise(cmd, options);

  return toType(stdout.trim()) || defaultValue;
}
