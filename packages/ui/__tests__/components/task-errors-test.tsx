import * as React from 'react';
import { render } from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import { TaskErrors } from '../../src/components/TaskErrors';

describe('TaskErrors', () => {
  it('does not render errors when no errors are present', () => {
    const { stdout } = render(<TaskErrors hasErrors={false} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot('""');
  });

  it('renders errors when errors are present', () => {
    const { stdout } = render(<TaskErrors hasErrors={true} />);

    expect(stripAnsi(stdout.lastFrame()!)).toMatchInlineSnapshot(`
      "Some tasks ran with errors. Use the \\"summary\\" formatter or use the \`--output-file\` option and review the \\"invocation.toolExecutionNotifications\\" property in the SARIF log for more details.
      "
    `);
  });
});
