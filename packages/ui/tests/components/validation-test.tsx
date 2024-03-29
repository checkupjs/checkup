import * as React from 'react';
import { render } from 'ink-testing-library';
import { RuleResults } from '@checkup/core';
import stripAnsi from 'strip-ansi';
import { Validation } from '../../src/components/Validation';

const TASK_RESULT: RuleResults = {
  rule: {
    id: 'my-fake-validation',
    shortDescription: {
      text: 'description',
    },
    properties: {
      taskDisplayName: 'Fake Validation',
      category: 'foo',
    },
  },
  results: [
    {
      message: {
        text: 'Check the first thing',
      },
      ruleId: 'my-fake-validation',
      kind: 'pass',
      level: 'none',
      ruleIndex: 0,
    },
    {
      message: {
        text: 'Check the second thing',
      },
      ruleId: 'my-fake-validation',
      kind: 'pass',
      level: 'none',
      ruleIndex: 0,
    },
    {
      message: {
        text: 'Check the third thing',
      },
      ruleId: 'my-fake-validation',
      kind: 'fail',
      level: 'error',
      ruleIndex: 0,
    },
  ],
};

describe('Validation', () => {
  it('can render task result', () => {
    const { stdout } = render(<Validation taskResult={TASK_RESULT} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
"Fake Validation
===============
Validation failed
  ✔ Check the first thing
  ✔ Check the second thing
  ✖ Check the third thing"
`);
  });
});
