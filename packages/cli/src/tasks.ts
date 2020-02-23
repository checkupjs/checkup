import { TaskConstructor, TaskName } from '@checkup/core';

let registeredTasks: Map<TaskName, TaskConstructor> = new Map<TaskName, TaskConstructor>();

/**
 * Gets an array of registered tasks that have been added via `registerTask` or `registerTasks`.
 *
 * @returns {Set<TaskConstructor>}
 */
export function getRegisteredTasks(): Map<TaskName, TaskConstructor> {
  return registeredTasks;
}

/**
 * Registers a single task.
 *
 * @param taskName {string}
 * @param task {TaskConstructor}
 */
export function registerTask(taskName: TaskName, task: TaskConstructor): void {
  registeredTasks.set(taskName, task);
}

/**
 * Registers one or more tasks.
 *
 * @param tasks {TaskConstructor[]}
 */
export function registerTasks(...tasks: { taskName: TaskName; task: TaskConstructor }[]): void {
  tasks.forEach(task => registerTask(task.taskName, task.task));
}
