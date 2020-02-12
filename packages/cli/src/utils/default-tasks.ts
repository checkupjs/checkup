import * as DefaultTasks from '../tasks';
import { ITaskConstructor } from '../types';

export function getTaskByName(name: string): ITaskConstructor {
  return <ITaskConstructor>(
    Object.values(DefaultTasks).find(task => name === task.name.replace('Task', ''))
  );
}

export function getTaskNames(): string[] {
  return Object.values(DefaultTasks).map(task => task.name.replace('Task', ''));
}
