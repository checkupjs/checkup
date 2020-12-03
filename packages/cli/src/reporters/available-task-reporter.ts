import { ui } from '@checkup/core';
import { bold } from 'chalk';
import TaskList from '../task-list';

export function reportAvailableTasks(pluginTasks: TaskList) {
  ui.blankLine();
  ui.log(bold.white('AVAILABLE TASKS'));
  ui.blankLine();
  pluginTasks.fullyQualifiedTaskNames.forEach((taskName) => {
    ui.log(`  ${taskName}`);
  });
  ui.blankLine();
}
