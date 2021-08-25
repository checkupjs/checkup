import { EventEmitter } from 'events';
import * as React from 'react';
// import { render } from 'ink-render-string';
import { CheckupLogParser, Formatter } from '@checkup/core';
import { render as inkRender } from 'ink';
import { Instance as InkInstance } from 'ink';
import { ReactElement } from 'react';
import { Options } from './types';
import { default as pretty } from './pretty-formatter';

class Stdout extends EventEmitter {
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

// interface Instance {
//   // stdout: Stdout;
//   // frames: string[];
//   lastFrame: () => string | undefined;
// }

const instances: InkInstance[] = [];

export const render = (tree: ReactElement): string => {
  const stdout = new Stdout();

  const instance = inkRender(tree, {
    stdout: stdout as any,
    debug: true,
    exitOnCtrlC: false,
    patchConsole: false,
  });

  instances.push(instance);

  return stdout.lastFrame() || 'stdout.lastFrame() is undefined';
};

class PrettyFormatter implements Formatter {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  format(logParser: CheckupLogParser): string {
    const result = render(React.createElement(pretty, { logParser }));

    return result;
  }
}

export default PrettyFormatter;
