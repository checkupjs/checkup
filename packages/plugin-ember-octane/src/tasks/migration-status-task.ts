import {
  BaseTask,
  Category,
  Parser,
  ParserName,
  Priority,
  TaskClassification,
  TaskName,
  TaskResult,
  ui,
} from '@checkup/core';

class MigrationStatusTaskResult implements TaskResult {
  toConsole() {
    ui.styledHeader(MigrationStatusTask.friendlyTaskName);
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

export default class MigrationStatusTask extends BaseTask {
  static taskName: TaskName = 'octane-migration-status';
  static friendlyTaskName: TaskName = 'Ember Octane Migration Status';
  static taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.Medium,
  };

  private parsers: Map<ParserName, Parser>;

  constructor(cliArguments: any, parsers: Map<ParserName, Parser>) {
    super(cliArguments);

    this.parsers = parsers;
  }

  async run(): Promise<TaskResult> {
    let esLintParser = this.parsers.get('eslint');
    esLintParser?.execute(['.']);
    let result = new MigrationStatusTaskResult();

    return result;
  }
}
