import { ux } from 'cli-ux';

export const ui = Object.assign(ux, {
  blankLine() {
    process.stdout.write('\n');
  },
});
