#!/usr/bin/env node

let args = process.argv.slice(2);

if (args[0] === 'docs') {
  const { generate } = require('../lib/generate-docs');

  generate();
}
