import * as chalk from 'chalk';
import { startCase } from 'lodash';
import CliTable3 = require('cli-table3');
import CheckupError from '../errors/checkup-error';

type Segment = { title: string; count: number; color?: chalk.Chalk };

export default abstract class BaseOutputWriter {
  abstract write(content: string): void;

  blankLine() {
    this.write('\n');
  }

  clearScreen() {
    this.write('\u001B[2J');
  }

  clearLine() {
    this.write('\u001B[0f');
  }

  categoryHeader(header: string) {
    this.write(chalk.dim('=== ') + chalk.bold(header) + '\n');
    this.blankLine();
  }

  sectionHeader(header: string) {
    this.write(this.emphasize(`${chalk.underline(startCase(header))}\n`));
    this.blankLine();
  }

  section(header: string | undefined, contents: () => void) {
    if (header) {
      this.sectionHeader(header);
      contents();
      this.blankLine();
    }
  }

  subHeader(header: string) {
    this.write(`${chalk.underline(startCase(header))}\n`);
    this.blankLine();
  }

  log(value: string) {
    this.write(value);
    this.blankLine();
  }

  dimmed(format: string) {
    this.log(chalk.dim(format));
  }

  emphasize(format: string) {
    return chalk.bold(format);
  }

  bar(title: string, complete: number, total: number, unit: string = '', maximum: number = 50) {
    const barTick = '■';
    const barSegment = Math.ceil(total / maximum);
    const completedSegments = Math.ceil(complete / barSegment);
    const incompleteSegments = maximum - completedSegments;
    const bar = `${this.randomColor()(barTick.repeat(completedSegments))}${chalk.grey(
      barTick.repeat(Math.max(0, incompleteSegments))
    )}`;

    this.log(title);
    this.log(`${bar} ${complete.toLocaleString()}${unit}`);
    this.blankLine();
  }

  table(rows: (string | number)[][], headers: string[]) {
    const table = new CliTable3({
      head: headers.map((header) => this.emphasize(chalk.white(header))),
      chars: {
        top: '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        bottom: '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        left: '',
        'left-mid': '',
        mid: '',
        'mid-mid': '',
        right: '',
        'right-mid': '',
        middle: ' ',
      },
      style: { 'padding-left': 0, 'padding-right': 0 },
    });

    rows.forEach((row) => {
      table.push(row);
    });

    this.log(table.toString());
  }

  sectionedBar(segments: Segment[], total: number, unit: string = '', width: number = 50) {
    const barTick = '■';
    const colors = this.colors();

    segments.forEach((segment, i) => {
      segment.color = colors[i + 3];
    });

    const { completedSegments, incompleteSegments } = calculateSectionBar(segments, total, width);

    const bar = `${completedSegments
      .map((segment) => segment.color!(barTick.repeat(segment.completed)))
      .join('')}${chalk.grey(barTick.repeat(Math.max(0, incompleteSegments)))}`;

    if (incompleteSegments > 0) {
      completedSegments.push({
        title: 'unknown',
        completed: incompleteSegments,
        count: incompleteSegments,
        color: chalk.grey,
      });
    }

    this.log(`${bar} ${total.toLocaleString()} ${unit}`);
    completedSegments.map((segment) =>
      this.log(`${segment.color!(barTick)} ${segment.title} (${segment.count.toLocaleString()})`)
    );
  }

  valuesList(
    values: { title: string; count: number }[],
    unit: string = '',
    color: chalk.Chalk = this.randomColor()
  ) {
    values.forEach((value) => {
      this.value(value, unit, color);
    });
  }

  styledJSON(object: any) {
    const json = JSON.stringify(object, undefined, 2);
    this.log(json);
  }

  value(
    value: { title: string; count: number },
    unit: string = '',
    color: chalk.Chalk = this.randomColor()
  ) {
    this.log(
      `${color('■')} ${value.title} (${value.count.toLocaleString()}${unit ? ' ' + unit : ''})`
    );
  }

  randomColor() {
    const colors = this.colors();
    return colors[Math.floor(Math.random() * colors.length)];
  }

  colors(range: number = 70) {
    const ANSI_CODE_START = 33;

    return Array.from({ length: range }).map((_, i) => chalk.ansi256(i + ANSI_CODE_START));
  }

  getColor(color: string | chalk.Chalk) {
    if (typeof color === 'string') {
      return chalk.keyword(color);
    }
    return color;
  }

  error(error: string | Error | CheckupError) {
    if (typeof error === 'string') {
      error = new Error(error);
    }

    console.error(
      error instanceof CheckupError ? error.render() : `\n${chalk.red('Error')} ${error.message}`
    );
  }
}

export function calculateSectionBar(
  segments: { title: string; count: number; color?: chalk.Chalk }[],
  total: number,
  width: number
) {
  // We want to normalize the amount provided by the proper ratios.
  // If the total is less than the width we want to multiply the ratio.
  // If the total is greater than the width we want to divide the amount vs the ratio
  const normalizeSegment = function (amount: number) {
    return Math.ceil(total < width ? amount * (width / total) : amount / (total / width));
  };

  const completedSegments = segments
    .map((segment) => {
      return Object.assign({}, segment, {
        completed: normalizeSegment(segment.count),
      });
    })
    .sort((a: Segment, b: Segment) => {
      if (a.count === b.count) {
        return a.title > b.title ? 1 : -1;
      }
      return b.count - a.count;
    });

  // remove  the segments counts from the total number and then normalize it by the barSegment ratio
  const incompleteSegments: number = normalizeSegment(
    total - completedSegments.reduce((prev, curr) => prev + curr.count, 0)
  );

  // if incompleteSegments is a negative number resulting from overflow we return 0
  return {
    completedSegments,
    incompleteSegments: incompleteSegments > 0 ? incompleteSegments : 0,
  };
}
