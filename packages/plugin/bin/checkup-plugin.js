#!/usr/bin/env node

let args = process.argv.slice(2);

if (args[0] === 'docs') {
  const { generate } = await import('../lib/generate-docs');

  generate();
}
