import stripAnsi = require('strip-ansi');
import BaseOutputWriter from './base-output-writer';

export default class BufferedWriter extends BaseOutputWriter {
  buffer: string = '';

  get escapedBuffer() {
    return stripAnsi(this.buffer);
  }

  write(content: string): void {
    this.buffer += content;
  }
}
