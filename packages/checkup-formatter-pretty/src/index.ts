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

// class Stderr extends EventEmitter {
//   readonly frames: string[] = [];
//   private _lastFrame?: string;

//   write = (frame: string) => {
//     this.frames.push(frame);
//     this._lastFrame = frame;
//   };

//   lastFrame = () => {
//     return this._lastFrame;
//   };
// }

// class Stdin extends EventEmitter {
//   isTTY = true;

//   write = (data: string) => {
//     this.emit('data', data);
//   };

//   setEncoding() {
//     // Do nothing
//   }

//   setRawMode() {
//     // Do nothing
//   }

//   resume() {
//     // Do nothing
//   }

//   pause() {
//     // Do nothing
//   }
// }

interface Instance {
  rerender: (tree: ReactElement) => void;
  unmount: () => void;
  cleanup: () => void;
  stdout: Stdout;
  // stderr: Stderr;
  // stdin: Stdin;
  frames: string[];
  lastFrame: () => string | undefined;
}

const instances: InkInstance[] = [];

export const render = (tree: ReactElement): Instance => {
  const stdout = new Stdout();
  // const stderr = new Stderr();
  // const stdin = new Stdin();

  const instance = inkRender(tree, {
    stdout: stdout as any,
    // stderr: stderr as any,
    // stdin: stdin as any,
    debug: true,
    exitOnCtrlC: false,
    patchConsole: false,
  });

  instances.push(instance);

  return {
    rerender: instance.rerender,
    unmount: instance.unmount,
    cleanup: instance.cleanup,
    stdout,
    // stderr,
    // stdin,
    frames: stdout.frames,
    lastFrame: stdout.lastFrame,
  };
};

class PrettyFormatter implements Formatter {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  format(logParser: CheckupLogParser): string {
    const { stdout } = render(React.createElement(pretty, { logParser }));

    return stdout.lastFrame() || 'stdout.lastFrame() is undefined';
  }
}

export default PrettyFormatter;
