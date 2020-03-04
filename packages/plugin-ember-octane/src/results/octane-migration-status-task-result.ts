import { CLIEngine } from 'eslint';
import { TaskName, TaskResult, ui } from '@checkup/core';

export default class OctaneMigrationStatusTaskResult implements TaskResult {
  constructor(public taskName: TaskName, public report: CLIEngine.LintReport) {}

  toConsole() {
    ui.styledHeader(this.taskName);
    ui.blankLine();
    ui.styledObject({
      'JS Error Count': this.report.errorCount,
    });
    ui.blankLine();
  }

  toJson() {
    return {};
  }
}
