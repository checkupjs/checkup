import { ui } from '@checkup/core';
import { bold } from 'chalk';
import TaskList from '../task-list';

export function reportAvailableTasks(pluginTasks: TaskList) {
  ui.blankLine();
  ui.log(bold.white('AVAILABLE TASKS'));
  ui.blankLine();
  if (pluginTasks.size > 0) {
    pluginTasks.fullyQualifiedTaskNames.forEach((taskName) => {
      ui.log(`  ${taskName}`);
    });
  } else {
    ui.log(`  No tasks found`);
  }
  ui.blankLine();
}
