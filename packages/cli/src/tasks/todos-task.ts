import { BaseTask, TaskResult, Task, Category, Priority, TaskMetaData, exec } from '@checkup/core';

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
    let result: TodosTaskResult = new TodosTaskResult(this.meta);
    result.count = await exec(
      `grep -r -i "TODO" ${this.context.cliArguments.path} | wc -l`,
      {},
      0,
      Number
    );

    return result;
  }
}
