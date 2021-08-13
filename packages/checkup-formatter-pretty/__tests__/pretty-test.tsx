import * as React from 'react';
import { render } from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import { CheckupLogParser } from '@checkup/core';
import PrettyFormatter from '../src/pretty-formatter';
import { result } from './__fixtures__/checkup-result';

describe('Test Pretty component', () => {
  it('can generate Pretty component', async () => {
    const logParser = new CheckupLogParser(result);
    const { stdout } = render(<PrettyFormatter logParser={logParser} />);
    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
      "Checkup report generated for pemberly-example-web v0.0.0  (0 files analyzed)
      This project is 5 years old, with 458 active days, 850 commits and 389 files


      lines of code 23
      ■■■■■■■■■■■■■■ js (14)
      ■■■■■■■ css (7)
      ■■ hbs (2)


      ┌──────────────────────────────┬───────────────┐
      │ ruleId                       │ result(value) │
      ├──────────────────────────────┼───────────────┤
      │ ember-types                  │ 10            │
      ├──────────────────────────────┼───────────────┤
      │ ember-in-repo-addons-engines │ 2             │
      ├──────────────────────────────┼───────────────┤
      │ ember-dependencies           │ 36            │
      ├──────────────────────────────┼───────────────┤
      │ outdated-dependencies        │ 147           │
      ├──────────────────────────────┼───────────────┤
      │ ember-template-lint-disables │ 1             │
      ├──────────────────────────────┼───────────────┤
      │ eslint-disables              │ 1             │
      └──────────────────────────────┴───────────────┘"
    `);
  });
});
