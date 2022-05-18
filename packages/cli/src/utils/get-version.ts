import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

export function getVersion(fakeVersion: string = '0.0.0') {
  if (process.env.JEST_WORKER_ID !== undefined) {
    return fakeVersion;
  }

  return version;
}
