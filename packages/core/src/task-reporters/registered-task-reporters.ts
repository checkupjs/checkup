import { TaskName, TaskReporter } from '../types/tasks';

const registeredTaskReporters = new Map<TaskName, TaskReporter>();

export function getRegisteredTaskReporters() {
  return registeredTaskReporters;
}

export function registerTaskReporter(taskName: TaskName, report: TaskReporter) {
  registeredTaskReporters.set(taskName, report);
}
