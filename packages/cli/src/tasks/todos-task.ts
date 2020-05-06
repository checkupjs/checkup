import {
  TaskResult,
  TaskContext,
  Task,
  Category,
  Priority,
  TaskMetaData,
  FileSearcherTask,
} from '@checkup/core';
import TodosTaskResult from '../results/todos-task-result';

export default class TodosTask extends FileSearcherTask implements Task {
  meta: TaskMetaData = {
    taskName: 'todos',
    friendlyTaskName: 'Number of TODOs',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.Low,
    },
  };

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context, { todo: ['TODO:'] });
  }

  async run(): Promise<TaskResult> {
    let result: TodosTaskResult = new TodosTaskResult(this.meta);
    let stringsFound = await this.searcher.findStrings();
    result.count = stringsFound.counts.todo;
    return result;
  }
}
