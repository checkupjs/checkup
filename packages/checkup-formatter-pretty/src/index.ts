import { EventEmitter } from 'events';
import * as React from 'react';
import { render as inkRender } from 'ink';
import { Instance as InkInstance } from 'ink';
import { ReactElement } from 'react';
import { CheckupLogParser, Formatter } from '@checkup/core';
import { default as pretty } from './pretty-formatter';
import { Options } from './types';
const console = require('console');

interface Instance {
  stdout: Stdout;
}

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

const instances: InkInstance[] = [];

const render = (tree: ReactElement): Instance => {
  const stdout = new Stdout();
  const instance = inkRender(tree, { stdout: stdout as any });

  instances.push(instance);

  return {
    stdout,
  };
};

class PrettyFormatter implements Formatter {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  format(logParser: CheckupLogParser) {
    const { stdout } = render(React.createElement(pretty, { logParser }));
    console.log('After render:', stdout);
    return stdout.lastFrame();
  }
}

export default PrettyFormatter;
