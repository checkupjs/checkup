import { BaseTaskResult, TaskResult, ui, ResultData, TaskMetaData } from '@checkup/core';

export default class TodosTaskResult extends BaseTaskResult implements TaskResult {
  stringsFound!: ResultData;
  todosCount: number;

  constructor(meta: TaskMetaData, stringsFound: ResultData) {
    super(meta);

    this.stringsFound = stringsFound;
    this.todosCount = stringsFound?.results.find((type) => type.type === 'todo')?.total || 0;
  }

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.log(`TODOs found: ${this.todosCount}`);
    });
  }

  toJson() {
    return { meta: this.meta, result: { todos: this.stringsFound.results } };
  }
}
