import stripAnsi from 'strip-ansi';
import BaseOutputWriter from './base-output-writer.js';

export default class BufferedWriter extends BaseOutputWriter {
  buffer: string = '';

  get escapedBuffer() {
    debugger;
    return stripAnsi(this.buffer);
  }

  write(content: string): void {
    this.buffer += content;
  }
}
