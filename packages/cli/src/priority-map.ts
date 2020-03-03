import { Priority, Task, TaskName } from '@checkup/core';

export default class PriorityMap {
  maps: Map<any, Map<TaskName, Task>>;

  constructor() {
    this.maps = new Map<Priority, Map<TaskName, Task>>([
      [Priority.High, new Map<TaskName, Task>()],
      [Priority.Medium, new Map<TaskName, Task>()],
      [Priority.Low, new Map<TaskName, Task>()],
    ]);
  }

  getTask(taskName: TaskName): Task | undefined {
    let task: Task | undefined;

    this.maps.forEach((tasks: Map<TaskName, Task>) => {
      if (tasks.has(taskName)) {
        task = tasks.get(taskName);
      }
    });

    return task;
  }

  getTaskByPriority(priority: Priority, taskName: TaskName): Task | undefined {
    let map = this.maps.get(priority);

    return map!.get(taskName);
  }

  setTaskByPriority(priority: Priority, taskName: TaskName, task: Task): void {
    let map = this.maps.get(priority);

    map!.set(taskName, task);
  }

  getTasks(priority: Priority): Map<TaskName, Task> {
    return this.maps.get(priority)!;
  }

  [Symbol.iterator](): Generator<[TaskName, Task]> {
    return this.entries();
  }

  *entries(): Generator<[TaskName, Task]> {
    for (let [, map] of this.maps) {
      for (let [taskName, task] of map) {
        yield [taskName, task];
      }
    }
  }

  *values(): Generator<Task> {
    for (let [, map] of this.maps) {
      for (let [, task] of map) {
        yield task;
      }
    }
  }

  get size() {
    return (
      this.maps.get(Priority.High)!.size +
      this.maps.get(Priority.Medium)!.size +
      this.maps.get(Priority.Low)!.size
    );
  }
}
