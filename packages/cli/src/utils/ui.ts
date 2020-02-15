import { ux } from 'cli-ux';

export const ui = Object.assign(ux, {
  blankLine() {
    process.stdout.write('\n');
  },

  clearScreen() {
    process.stdout.write('\x1b[2J');
  },

  clearLine() {
    process.stdout.write('\x1b[0f');
  },
});
