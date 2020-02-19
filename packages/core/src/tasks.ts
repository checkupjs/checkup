import { TaskConstructor } from './types';

let registeredTasks: Set<TaskConstructor> = new Set<TaskConstructor>();

/**
 * Gets an array of registered tasks that have been added via `registerTask` or `registerTasks`.
 *
 * @returns {Set<TaskConstructor>}
 */
export function getRegisteredTasks(): TaskConstructor[] {
  return Array.from(registeredTasks);
}

/**
 * Registers a single task.
 *
 * @param task {TaskConstructor}
 */
export function registerTask(task: TaskConstructor): void {
  registeredTasks.add(task);
}

/**
 * Registers one or more tasks.
 *
 * @param tasks {TaskConstructor[]}
 */
export function registerTasks(...tasks: TaskConstructor[]): void {
  tasks.forEach(task => registeredTasks.add(task));
}
