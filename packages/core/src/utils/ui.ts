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

  sectionHeader(header: string) {
    process.stdout.write(
      `${chalk.dim('===')} ${chalk.bold(chalk.white(header))} ${chalk.dim('===')}\n`
    );
    ui.blankLine();
  },

  section(header: string, contents: () => void) {
    ui.sectionHeader(header);
    contents();
    ui.blankLine();
  },

  subHeader(header: string) {
    ui.styledHeader(header);
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

  bar(title: string, complete: number, total: number, unit: string, maximum: number = 50) {
    const barTick = '■';
    const barSegment = Math.ceil(total / maximum);
    const fullSegments = Math.ceil(complete / barSegment);
    const emptySegments = maximum - fullSegments;
    const bar = `${chalk.green(barTick.repeat(fullSegments))}${chalk.grey(
      barTick.repeat(emptySegments)
    )}`;

    ui.log(title);
    ui.log(`${bar} ${complete}${unit}`);
    ui.blankLine();
  },
});
