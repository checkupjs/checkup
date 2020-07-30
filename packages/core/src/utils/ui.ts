import * as chalk from 'chalk';

import { ux } from 'cli-ux';
import { startCase } from 'lodash';

const wrap = require('wrap-ansi');
const boxen = require('boxen');

export function calculateSectionBar(
  segments: { title: string; count: number; color: string }[],
  total: number,
  width: number
) {
  // We want to normalize the amount provided by the proper ratios.
  // If the total is less than the width we want to multiply the ratio.
  // If the total is greater than the width we want to divide the amount vs the ratio
  const normalizeSegment = function (amount: number) {
    return Math.ceil(total < width ? amount * (width / total) : amount / (total / width));
  };

  const completedSegments = segments.map((segment) => {
    return Object.assign({}, segment, {
      completed: normalizeSegment(segment.count),
    });
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

export const ui = Object.assign(ux, {
  box(content: string) {
    process.stdout.write(
      boxen(wrap(content, 80, { trim: false, hard: true }), {
        padding: 1,
        borderStyle: 'double',
      })
    );
    ui.blankLine();
  },

  blankLine() {
    process.stdout.write('\n');
  },

  clearScreen() {
    process.stdout.write('\u001B[2J');
  },

  clearLine() {
    process.stdout.write('\u001B[0f');
  },

  categoryHeader(header: string) {
    ui.styledHeader(header);
    ui.blankLine();
  },

  sectionHeader(header: string) {
    process.stdout.write(this.emphasize(`${chalk.underline(chalk.white(startCase(header)))}\n`));
    ui.blankLine();
  },

  section(header: string, contents: () => void) {
    ui.sectionHeader(header);
    contents();
    ui.blankLine();
  },

  subHeader(header: string) {
    process.stdout.write(`${chalk.underline(chalk.white(startCase(header)))}\n`);
    ui.blankLine();
  },

  subSection(header: string, contents: () => void) {
    ui.subHeader(header);
    contents();
    ui.blankLine();
  },

  dimmed(format: string) {
    ui.log(chalk.dim(format));
  },

  emphasize(format: string) {
    return chalk.bold(chalk.white(format));
  },

  bar(title: string, complete: number, total: number, unit: string = '', maximum: number = 50) {
    const barTick = '■';
    const barSegment = Math.ceil(total / maximum);
    const completedSegments = Math.ceil(complete / barSegment);
    const incompleteSegments = maximum - completedSegments;
    const bar = `${chalk.green(barTick.repeat(completedSegments))}${chalk.grey(
      barTick.repeat(Math.max(0, incompleteSegments))
    )}`;

    ui.log(title);
    ui.log(`${bar} ${complete.toLocaleString()}${unit}`);
    ui.blankLine();
  },

  sectionedBar(
    segments: { title: string; count: number; color: string }[],
    total: number,
    unit: string = '',
    width: number = 50
  ) {
    const barTick = '■';

    const { completedSegments, incompleteSegments } = calculateSectionBar(segments, total, width);

    const bar = `${completedSegments
      .map((segment) => chalk.keyword(segment.color)(barTick.repeat(segment.completed)))
      .join('')}${chalk.grey(barTick.repeat(Math.max(0, incompleteSegments)))}`;

    if (incompleteSegments > 0) {
      completedSegments.push({
        title: 'unknown',
        completed: incompleteSegments,
        count: incompleteSegments,
        color: 'grey',
      });
    }

    ui.log(`${bar} ${total.toLocaleString()}${unit}`);
    completedSegments.map((segment) =>
      ui.log(
        `${chalk.keyword(segment.color)(barTick)} ${
          segment.title
        } (${segment.count.toLocaleString()})`
      )
    );
  },
});
