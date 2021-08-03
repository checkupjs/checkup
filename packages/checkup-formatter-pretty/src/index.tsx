import { Formatter, FormatterArgs } from '@checkup/core';
import * as React from 'react';
import { render } from 'ink';

import Pretty from './pretty';

class PrettyFormatter implements Formatter {
  constructor(public args: FormatterArgs) {}

  async format() {
    let data: string[] = ['table', 'list'];

    let app = render(<Pretty data={data} />);

    await app.waitUntilExit();
  }
}

export = PrettyFormatter;
