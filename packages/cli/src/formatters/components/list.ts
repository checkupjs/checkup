import { BaseOutputWriter } from '@checkup/core';
import * as chalk from 'chalk';

export default class ListComponent {
  name: string = 'list';

  constructor(private writer: BaseOutputWriter) {}

  render(
    values: {
      title: string;
      count: number;
    }[],
    unit?: string,
    color?: chalk.Chalk
  ) {
    this.writer.valuesList(values, unit, color);
    this.writer.blankLine();
  }
}
