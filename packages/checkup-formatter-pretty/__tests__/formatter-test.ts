/* eslint-disable jest/no-disabled-tests */
import { resolve } from 'path';
import { readJsonSync } from 'fs-extra';
import { CheckupLogParser, FormatterOptions } from '@checkup/core';
const stripAnsi = require('strip-ansi');
const PrettyFormatter = require('../src');

describe('Test Pretty formatter', () => {
  it('can generate string from format', async () => {
    const log = readJsonSync(resolve(__dirname, './__fixtures__/checkup-result.sarif'));
    const logParser = new CheckupLogParser(log);
    const options: FormatterOptions = {
      cwd: '',
      format: 'checkup-formatter-pretty',
    };

    let formatter = new PrettyFormatter(options);

    const result = await formatter.format(logParser);

    expect(stripAnsi(result)).toMatchInlineSnapshot(`
      "Checkup report generated for travis v0.0.1  (1693 files analyzed)
      This project is 9 years old, with 1468 active days, 6010 commits and 1692 files


      lines of code 104439
      ■■■■■■■■■■■■■■■■■■■■■■■■■ js (50740)
      ■■■■■■■■■■■■ svg (24112)
      ■■■■■■■■ scss (15626)
      ■■■■■■■ hbs (13121)
      ■ rb (639)
      ■ html (201)


      Ember Types
      Total: 839


      Template Lint Summary
      Total: 673


      Number of eslint-disable Usages
      Total: 27


      Outdated Dependencies
      Total: 40


      Ember Dependencies
      Total: 37




      checkup v1.0.0-beta.11
      config 257cda6f6d50eeef891fc6ec8d808bdb"
    `);
  });

  it.skip('can throw error when custom component is not valid', () => {
    const log = readJsonSync(resolve(__dirname, './__fixtures__/checkup-result.sarif'));
    const logParser = new CheckupLogParser(log);

    const options: FormatterOptions = {
      cwd: '',
      format: 'checkup-formatter-pretty',
      componentName: 'invalidComponent',
    };

    let formatter = new PrettyFormatter(options);

    expect(formatter.format(logParser)).toThrowErrorMatchingInlineSnapshot(``);
  });
});
