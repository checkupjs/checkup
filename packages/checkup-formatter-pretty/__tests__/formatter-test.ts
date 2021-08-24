/* eslint-disable jest/no-disabled-tests */
import { resolve } from 'path';
import { readJsonSync } from 'fs-extra';
import { CheckupLogParser } from '@checkup/core';
import PrettyFormatter from '../src/index';
import { Options } from '../src/types';
const stripAnsi = require('strip-ansi');

describe('Test Pretty formatter', () => {
  it('use ink test library directly', () => {
    const log = readJsonSync(resolve(__dirname, './__fixtures__/checkup-result.sarif'));
    const logParser = new CheckupLogParser(log);
    const options: Options = {
      cwd: '',
      format: 'checkup-formatter-pretty',
    };

    let formatter = new PrettyFormatter(options);
    const result = formatter.testRender(logParser);

    expect(stripAnsi(result)).toMatchInlineSnapshot(`
      "Checkup report generated for travis v0.0.1  (1797 files analyzed)
      This project is 9 years old, with 1448 active days, 5983 commits and 1667 files


      lines of code 101513
      ■■■■■■■■■■■■■■■■■■■■■■■■■ js (49161)
      ■■■■■■■■■■■■ svg (24112)
      ■■■■■■■■ scss (14936)
      ■■■■■■■ hbs (12464)
      ■ rb (639)
      ■ html (201)


      === metrics
      ┌─────────────┬───────────────┐
      │ ruleId      │ result(value) │
      ├─────────────┼───────────────┤
      │ ember-types │ 810           │
      └─────────────┴───────────────┘


      checkup v1.0.0-beta.11
      config 7bca477eada135bcfae0876e271fff89"
    `);
  });

  it.skip('can generate string from format', () => {
    const log = readJsonSync(resolve(__dirname, './__fixtures__/checkup-result.sarif'));
    const logParser = new CheckupLogParser(log);
    const options: Options = {
      cwd: '',
      format: 'checkup-formatter-pretty',
    };

    let formatter = new PrettyFormatter(options);

    const result = formatter.format(logParser);

    expect(stripAnsi(result)).toMatchInlineSnapshot(`
      "Checkup report generated for travis v0.0.1  (1797 files analyzed)
      This project is 9 years old, with 1448 active days, 5983 commits and 1667 files


      lines of code 101513
      ■■■■■■■■■■■■■■■■■■■■■■■■■ js (49161)
      ■■■■■■■■■■■■ svg (24112)
      ■■■■■■■■ scss (14936)
      ■■■■■■■ hbs (12464)
      ■ rb (639)
      ■ html (201)


      === metrics
      ┌─────────────┬───────────────┐
      │ ruleId      │ result(value) │
      ├─────────────┼───────────────┤
      │ ember-types │ 810           │
      └─────────────┴───────────────┘


      checkup v1.0.0-beta.11
      config 7bca477eada135bcfae0876e271fff89
      "
    `);
  });
});
