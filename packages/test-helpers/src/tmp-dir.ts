import { realpathSync } from 'fs';
import tmp = require('tmp');

/**
 * Creates a tmp directory with unsafe cleanup allowed.
 *
 * @returns {string} The path of the tmp directory
 */
export function createTmpDir() {
  return realpathSync(tmp.dirSync({ unsafeCleanup: true }).name);
}
