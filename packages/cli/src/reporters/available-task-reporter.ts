import { ui } from '@checkup/core';
import { bold } from 'chalk';

export function reportAvailableTasks(availableTasks: string[]) {
  ui.blankLine();
  ui.log(bold.white('AVAILABLE TASKS'));
  ui.blankLine();
  if (availableTasks.length > 0) {
    availableTasks.forEach((taskName) => {
      ui.log(`  ${taskName}`);
    });
  } else {
    ui.log(`  No tasks found`);
  }
  ui.blankLine();
}
