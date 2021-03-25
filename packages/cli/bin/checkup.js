#!/usr/bin/env node

require('v8-compile-cache');

const { run } = require('../lib/checkup');

if (require.main === module) {
  run();
}
