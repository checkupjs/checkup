import * as Table from 'cli-table3';
import * as capitalize from 'capitalize';
import * as chalk from 'chalk';
import * as columnify from 'columnify';

import { IConsoleWriter, IDictionary } from '../types';

const BRAND = {
  heading: chalk.rgb(224, 78, 58),
  title: chalk.rgb(246, 234, 231),
};

export default class ConsoleWriter implements IConsoleWriter {
  columns: number;
  log: (message?: any, ...optionalParams: any[]) => void;

  constructor(log = console.log, { columns } = process.stdout) {
    this.log = log;
    this.columns = typeof columns !== 'undefined' && columns < 80 ? columns : 80;
  }

  heading(heading: string) {
    this.divider();
    this.text(BRAND.heading(`${this.indent()}${heading}`));
    this.divider();
  }

  divider() {
    this.log('='.repeat(this.columns));
  }

  text(text: string) {
    this.log(text);
  }

  indent(spaces: number = 2) {
    return ' '.repeat(spaces);
  }

  line() {
    this.log(' ');
  }

  column<T>(data: IDictionary<T>) {
    let keys = Object.keys(data);

    this.log(
      columnify(data, {
        showHeaders: false,
        minWidth: 20,
        dataTransform: (data: string) => {
          return keys.includes(data) ? BRAND.title(`${this.indent()}${capitalize(data)}`) : data;
        },
      })
    );
  }

  table<T>(heading: string[] | string, dict: IDictionary<T>) {
    var table: Table.HorizontalTable = new Table() as Table.HorizontalTable;

    if (typeof heading === 'string') {
      // table.options.style = Object.assign({ head: [] , border: [] }, table.options.style);
      table.push([{ colSpan: 2, content: BRAND.heading(heading) }]);
    } else {
      table.options.head = heading.map(h => BRAND.heading(h));
    }

    Object.keys(dict).forEach((key: string) => {
      table.push([key, String(dict[key])]);
    });

    this.log(table.toString());
  }

  singleColumnTable(heading: string, rowData: string[]) {
    let table: Table.HorizontalTable = new Table({
      head: [BRAND.heading(heading)],
    }) as Table.HorizontalTable;

    rowData.forEach((value: string) => {
      table.push([value]);
    });

    this.log(table.toString());
  }
}
