import { dirname } from 'dirname-filename-esm';
import resolve from 'resolve';

export function resolveModulePath(moduleName: string, baseDir: string = dirname(import.meta)) {
  return resolve.sync(moduleName, {
    basedir: baseDir,
    extensions: ['.js', '.mjs', '.cjs'],
  });
}
