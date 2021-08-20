import { resolve } from 'path';
import { readJsonSync } from 'fs-extra';
import { CheckupLogParser, FormatterOptions } from '@checkup/core';

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

    const PrettyFormatter = require('../src/index');
    let formatter = new PrettyFormatter(options);

    const result = await formatter.format(logParser);

    expect(result).toMatchInlineSnapshot(`
      "Checkup report generated for travis v0.0.1  (1797 files analyzed)
      This project is 9 years old, with 1448 active days, 5983 commits and 1667 files


      lines of code 101513
      [38;2;232;92;245m■■■■■■■■■■■■■■■■■■■■■■■■■ js (49161)[39m
      [38;2;211;226;41m■■■■■■■■■■■■ svg (24112)[39m
      [38;2;238;228;150m■■■■■■■■ scss (14936)[39m
      [38;2;170;221;51m■■■■■■■ hbs (12464)[39m
      [38;2;138;136;134m■ rb (639)[39m
      [38;2;54;62;181m■ html (201)[39m


      === metrics
      [1m┌[22m[1m─────────────[22m[1m┬[22m[1m───────────────[22m[1m┐[22m
      [1m│[22m[1m[34m ruleId      [22m[39m[1m│[22m[1m[34m result(value) [22m[39m[1m│[22m
      [1m├[22m[1m─────────────[22m[1m┼[22m[1m───────────────[22m[1m┤[22m
      [1m│[22m ember-types [1m│[22m 810           [1m│[22m
      [1m└[22m[1m─────────────[22m[1m┴[22m[1m───────────────[22m[1m┘[22m


      checkup v1.0.0-beta.11
      config 7bca477eada135bcfae0876e271fff89
      "
    `);
  });
});
