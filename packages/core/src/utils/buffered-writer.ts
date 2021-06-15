import BaseOutputWriter from './base-output-writer';

export default class BufferedWriter extends BaseOutputWriter {
  outputString: string = '';

  write(content: string): void {
    this.outputString += content;
  }
}
