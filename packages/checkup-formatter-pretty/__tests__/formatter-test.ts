import { resolve } from 'path';
import { readJsonSync } from 'fs-extra';
import { CheckupLogParser } from '@checkup/core';
import PrettyFormatter from '../src/index';
import { Options } from '../src/types';
const stripAnsi = require('strip-ansi');

describe('Test Pretty formatter', () => {
  it('can generate string from format', () => {
    const log = readJsonSync(resolve(__dirname, './__fixtures__/checkup-result.sarif'));
    const logParser = new CheckupLogParser(log);
    const options: Options = {
      cwd: '',
      format: 'checkup-formatter-pretty',
    };

    let formatter = new PrettyFormatter(options);

    const result = formatter.format(logParser);

    expect(stripAnsi(result)).toContain(`Checkup report generated for travis v0.0.1`);
  });
});
