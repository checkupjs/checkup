const util = require('util');
const execAsPromise = util.promisify(require('child_process').exec);

/**
 * @param {string} cmd - The command to run
 * @param {any} options - Options passed to the command
 * @param {string|number} defaultValue - Default value returned if the command returns no value
 * @param {Function} toType - A function used to convert a result to a specific type
 * @returns {string|number} - The result of the command
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
