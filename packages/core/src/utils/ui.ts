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
});
