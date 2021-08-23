import { EventEmitter } from 'events';
import * as React from 'react';
import { render } from 'ink';
import { CheckupLogParser, Formatter } from '@checkup/core';
import { default as pretty } from './pretty-formatter';
import { Options } from './types';
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
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  format(logParser: CheckupLogParser) {
    const stdout = new Stdout();
    console.log('Before render:', stdout);
    console.log('render function from ink:', render.toString());
    render(React.createElement(pretty, { logParser }), { stdout: stdout as any });
    console.log('After render:', stdout);
    return stdout.lastFrame();
  }
}

export default PrettyFormatter;
