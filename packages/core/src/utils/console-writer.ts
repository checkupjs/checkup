import BaseOutputWriter from './base-output-writer';
export default class ConsoleWriter extends BaseOutputWriter {
  write(content: string): void {
    process.stdout.write(content);
  }
}
