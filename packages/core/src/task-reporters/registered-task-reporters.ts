import { TaskName, TaskFormatter } from '../types/tasks';

const registeredTaskReporters = new Map<TaskName, TaskFormatter>();

/**
 * Get a map of registered task report
 *
 * @return registeredTaskReporters - Map<TaskName, TaskFormatter>
 */
export function getRegisteredTaskReporters() {
  return registeredTaskReporters;
}

/**
 * Register reports for tasks
 * @param  {TaskName} taskName
 * @param  {TaskFormatter} report
 */
export function registerTaskReporter(taskName: TaskName, report: TaskFormatter) {
  registeredTaskReporters.set(taskName, report);
}
