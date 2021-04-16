import { ConsoleWriter } from '@checkup/core';

export function reportAvailableTasks(availableTasks: string[]) {
  let consoleWriter = new ConsoleWriter();

  consoleWriter.blankLine();
  consoleWriter.log(consoleWriter.emphasize('AVAILABLE TASKS'));
  consoleWriter.blankLine();
  if (availableTasks.length > 0) {
    availableTasks.forEach((taskName) => {
      consoleWriter.log(`  ${taskName}`);
    });
  } else {
    consoleWriter.log(`  No tasks found`);
  }
  consoleWriter.blankLine();
}
