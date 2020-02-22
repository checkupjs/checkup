import { TaskConstructor } from './types';

let registeredTasks: Map<string, TaskConstructor> = new Map<string, TaskConstructor>();

/**
 * Gets an array of registered tasks that have been added via `registerTask` or `registerTasks`.
 *
 * @returns {Set<TaskConstructor>}
 */
export function getRegisteredTasks(): Map<string, TaskConstructor> {
  return registeredTasks;
}

/**
 * Registers a single task.
 *
 * @param taskName {string}
 * @param task {TaskConstructor}
 */
export function registerTask(taskName: string, task: TaskConstructor): void {
  registeredTasks.set(taskName, task);
}

/**
 * Registers one or more tasks.
 *
 * @param tasks {TaskConstructor[]}
 */
// export function registerTasks(...tasks): void {
//   tasks.forEach(task => registeredTasks.set(taskName, task));
// }
