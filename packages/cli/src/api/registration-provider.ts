import {
  TaskName,
  TaskActionsEvaluator,
  Task,
  RegistrationProvider,
  RegistrationProviderOptions,
  RegisterableTaskList,
} from '@checkup/core';

export default class PluginRegistrationProvider implements RegistrationProvider {
  registeredActions: Map<TaskName, TaskActionsEvaluator>;
  registeredTasks: RegisterableTaskList;

  constructor(options: RegistrationProviderOptions) {
    this.registeredActions = options.registeredActions;
    this.registeredTasks = options.registeredTasks;
  }

  actions(taskName: TaskName, evaluate: TaskActionsEvaluator): void {
    this.registeredActions.set(taskName, evaluate);
  }

  task(task: Task): void {
    this.registeredTasks.registerTask(task);
  }
}
