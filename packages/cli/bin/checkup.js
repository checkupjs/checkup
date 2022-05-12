#!/usr/bin/env node

import 'v8-compile-cache';
import { createRequire } from 'module';
import importLocal from 'import-local';

const require = createRequire(import.meta.url);
const checkup = importLocal(require.resolve('../lib/checkup.js'));

if (checkup) {
  checkup.run();
} else {
  // eslint-disable-next-line import/extensions
  const { run } = await import('../lib/checkup.js');
  run();
}
