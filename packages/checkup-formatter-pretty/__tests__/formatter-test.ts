import { resolve } from 'path';
import { readJsonSync } from 'fs-extra';
import { CheckupLogParser, FormatterOptions } from '@checkup/core';
import PrettyFormatter from '../src/index';
const console = require('console');
const stripAnsi = require('strip-ansi');

enum OutputFormat {
  summary = 'summary',
  json = 'json',
  pretty = 'pretty',
}

describe('Test Pretty formatter', () => {
  it('can generate string from format', async () => {
    const log = readJsonSync(resolve(__dirname, './__fixtures__/checkup-result.sarif'));
    const logParser = new CheckupLogParser(log);
    const options: FormatterOptions = {
      cwd: '',
      format: OutputFormat.pretty,
    };

    let formatter = new PrettyFormatter(options);

    const result = formatter.format(logParser);

    console.log('!!!!!');
    console.log('result:', result);

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
