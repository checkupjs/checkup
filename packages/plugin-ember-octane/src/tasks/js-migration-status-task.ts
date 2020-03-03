import {
  BaseTask,
  Category,
  Priority,
  TaskClassification,
  TaskName,
  TaskResult,
  ui,
} from '@checkup/core';

class JSMigrationStatusTaskResult implements TaskResult {
  toConsole() {
    ui.styledHeader(JSMigrationStatusTask.friendlyTaskName);
    ui.blankLine();
    ui.styledObject({
      lewis: 'miller',
    });
    ui.blankLine();
  }

  toJson() {
    return {};
  }
}

export default class JSMigrationStatusTask extends BaseTask {
  static taskName: TaskName = 'js-migration-status';
  static friendlyTaskName: TaskName = 'Ember Octane JS Migration Status';
  static taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.Medium,
  };

  async run(): Promise<TaskResult> {
    const result = new JSMigrationStatusTaskResult();

    return result;
  }
}
