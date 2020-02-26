import { BaseTask, TaskName, TaskResult, ui } from '@checkup/core';

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

  async run(): Promise<TaskResult> {
    const res = new JSMigrationStatusTaskResult();

    return res;
  }
}
