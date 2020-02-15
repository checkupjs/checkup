import * as DefaultTasks from '../tasks';
import { TaskConstructor } from '@checkup/core';

export function getTaskByName(name: string): TaskConstructor {
  return <TaskConstructor>(
    Object.values(DefaultTasks).find(task => name === task.name.replace('Task', ''))
  );
}

export function getTaskNames(): string[] {
  return Object.values(DefaultTasks).map(task => task.name.replace('Task', ''));
}
