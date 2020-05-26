import {
  TaskResult,
  findInFiles,
  Task,
  Category,
  Priority,
  TaskMetaData,
  BaseTask,
} from '@checkup/core';
import TodosTaskResult from '../results/todos-task-result';

export default class TodosTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'todos',
    friendlyTaskName: 'Number of TODOs',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.Low,
    },
  };

  async run(): Promise<TaskResult> {
    let stringsFound = await findInFiles(this.context.paths, [
      { patternName: 'todo', patterns: ['TODO:'] },
    ]);
    return new TodosTaskResult(this.meta, stringsFound);
  }
}
