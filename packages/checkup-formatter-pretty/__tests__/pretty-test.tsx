/* eslint-disable jest/no-focused-tests */
import { resolve } from 'path';
import * as React from 'react';
import { render } from 'ink-testing-library';
import { readJsonSync } from 'fs-extra';
import { CheckupLogParser } from '@checkup/core';
import PrettyFormatter from '../src/pretty-formatter';

const stripAnsi = require('strip-ansi');

describe.only('Test Pretty component', () => {
  it.only('can generate Pretty component', async () => {
    const log = readJsonSync(resolve(__dirname, './__fixtures__/checkup-result.sarif'));
    const logParser = new CheckupLogParser(log);

    const { stdout } = render(<PrettyFormatter logParser={logParser} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
      "Checkup report generated for travis v0.0.1  (1797 files analyzed)
      This project is 9 years old, with 1448 active days, 5983 commits and 1667 files


      lines of code 101513
      ■■■■■■■■■■■■■■■■■■■■■■■■■ js (49161)
      ■■■■■■■■■■■■ svg (24112)
      ■■■■■■■■ scss (14936)
      ■■■■■■■ hbs (12464)
      ■ rb (639)
      ■ html (201)


      Ember Types
      Total: 810


      Eslint Summary
      Total: 29


      Ember Test Types
      Total: 610


      Ember Octane Migration Status Native Classes
      Total: 435


      Ember Octane Migration Status Glimmer Components
      Total: 238


      Ember Octane Migration Status Tagless Components
      Total: 150


      Ember Octane Migration Status Tracked Properties
      Total: 2


      Ember Template Lint Summary
      Total: 632


      Eslint Disables
      Total: 27


      Outdated Dependencies
      Total: 52


      Ember Dependencies
      Total: 34




      checkup v1.0.0-beta.11
      config 7bca477eada135bcfae0876e271fff89"
    `);
  });
});
