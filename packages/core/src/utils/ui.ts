import * as chalk from 'chalk';

import { ux } from 'cli-ux';

export const ui = Object.assign(ux, {
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
    process.stdout.write(this.emphasize(`${chalk.underline(chalk.white(header))}\n`));
    ui.blankLine();
  },

  section(header: string, contents: () => void) {
    ui.sectionHeader(header);
    contents();
    ui.blankLine();
  },

  subHeader(header: string) {
    process.stdout.write(`${chalk.underline(chalk.white(header))}\n`);
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
    ui.log(`${bar} ${complete}${unit}`);
    ui.blankLine();
  },

  sectionedBar(
    segments: { title: string; count: number; color: string }[],
    total: number,
    unit: string = '',
    maximum: number = 50
  ) {
    const barTick = '■';
    const barSegment = Math.ceil(total / maximum);
    const completedSegments = segments.map((segment) => {
      return Object.assign({}, segment, {
        completed: Math.ceil(segment.count / barSegment),
      });
    });

    const incompleteSegments =
      maximum - completedSegments.reduce((prev, curr) => prev + curr.completed, 0);
    const bar = `${completedSegments
      .map((segment) => chalk.keyword(segment.color)(barTick.repeat(segment.completed)))
      .join('')}${chalk.grey(barTick.repeat(Math.max(0, incompleteSegments)))}`;

    ui.log(`${bar} ${total}${unit}`);
    ui.log(
      `${completedSegments
        .map(
          (segment) =>
            `${chalk.keyword(segment.color)(barTick)} ${segment.title} (${segment.count})  `
        )
        .join('')}`
    );
  },
});
