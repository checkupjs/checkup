import {
  TaskName,
  TaskActionsEvaluator,
  TaskFormatter,
  Task,
  RegistrationProvider,
  RegistrationProviderOptions,
  RegisterableTaskList,
} from '@checkup/core';

export default class PluginRegistrationProvider implements RegistrationProvider {
  registeredActions: Map<TaskName, TaskActionsEvaluator>;
  registeredTaskReporters: Map<string, TaskFormatter>;
  registeredTasks: RegisterableTaskList;

  constructor(options: RegistrationProviderOptions) {
    this.registeredActions = options.registeredActions;
    this.registeredTaskReporters = options.registeredTaskReporters;
    this.registeredTasks = options.registeredTasks;
  }

  actions(taskName: TaskName, evaluate: TaskActionsEvaluator): void {
    this.registeredActions.set(taskName, evaluate);
  }

  taskFormatter(taskName: TaskName, report: TaskFormatter): void {
    this.registeredTaskReporters.set(taskName, report);
  }

  task(task: Task): void {
    this.registeredTasks.registerTask(task);
  }
}
