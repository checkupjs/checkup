import { EventEmitter } from 'events';
import * as React from 'react';
import { render } from 'ink';
import { CheckupLogParser, Formatter, FormatterOptions } from '@checkup/core';
import { default as pretty } from './pretty-formatter';
const console = require('console');

class Stdout extends EventEmitter {
  get columns() {
    return 100;
  }

  readonly frames: string[] = [];
  private _lastFrame?: string;

  write = (frame: string) => {
    this.frames.push(frame);
    this._lastFrame = frame;
  };

  lastFrame = () => {
    return this._lastFrame;
  };
}

class PrettyFormatter implements Formatter {
  options: FormatterOptions;

  constructor(options: FormatterOptions) {
    this.options = options;
  }

  format(logParser: CheckupLogParser) {
    const stdout = new Stdout();
    render(React.createElement(pretty, { logParser }), { stdout: stdout as any });
    console.log('lastFrame:', stdout.lastFrame());
    return stdout.lastFrame();
  }
}

export default PrettyFormatter;
