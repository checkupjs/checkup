// import { EventEmitter } from 'events';
import * as React from 'react';
// import { render as inkRender } from 'ink';
// import { Instance as InkInstance } from 'ink';
// import { ReactElement } from 'react';
import { render as inkTestRender } from 'ink-testing-library';
import { CheckupLogParser, Formatter } from '@checkup/core';
import { default as pretty } from './pretty-formatter';
import { Options } from './types';

// interface Instance {
//   stdout: Stdout;
// }

// class Stdout extends EventEmitter {
//   private _lastFrame?: string;

//   write = (frame: string) => {
//     this._lastFrame = frame;
//   };

//   lastFrame = () => {
//     return this._lastFrame;
//   };
// }

// const instances: InkInstance[] = [];

// const render = (tree: ReactElement): Instance => {
//   const stdout = new Stdout();
//   const instance = inkRender(tree, { stdout: stdout as any });
//   // console.log('In render function: instance:', instance);
//   // console.log('In render function: stdout:', stdout);
//   instances.push(instance);

//   return { stdout };
// };

class PrettyFormatter implements Formatter {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  format(logParser: CheckupLogParser): string {
    const { lastFrame } = inkTestRender(React.createElement(pretty, { logParser }));
    const result = lastFrame();

    return result || 'No output to checkup-formatter-pretty';
  }
}

export default PrettyFormatter;
