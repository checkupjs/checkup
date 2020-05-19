import { BaseTaskResult, TaskResult, ui } from '@checkup/core';

export default class TodosTaskResult extends BaseTaskResult implements TaskResult {
  count!: number;

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.log(`TODOs found: ${this.count}`);
    });
  }

  toJson() {
    return {
      todos: this.count,
    };
  }
}
