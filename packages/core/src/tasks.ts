import { TaskConstructor } from './types';

let tasks: TaskConstructor[] = [];

export function getTasks(): TaskConstructor[] {
  return tasks;
}

export function registerTask(task: TaskConstructor): void {
  tasks.push(task);
}
