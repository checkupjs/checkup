#!/usr/bin/env node

import { createRequire } from 'module';
import importLocal from 'import-local';

process.env.NODE_ENV = 'production';

const require = createRequire(import.meta.url);
const checkup = importLocal(require.resolve('../lib/checkup.js'));

if (checkup) {
  checkup.run();
} else {
  // eslint-disable-next-line import/extensions
  const { run } = await import('../lib/checkup.js');
  run();
}
