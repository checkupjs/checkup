#!/usr/bin/env node

require('v8-compile-cache');

const importLocal = require('import-local');
const checkup = importLocal(require.resolve('../lib/checkup.js'));

if (checkup) {
  checkup.run();
} else {
  const { run } = require('../lib/checkup');
  run();
}
