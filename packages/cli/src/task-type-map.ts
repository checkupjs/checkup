import { TaskType, Task, TaskName } from '@checkup/core';

export default class TaskTypeMap {
  maps: Map<TaskType, Map<TaskName, Task>>;

  constructor() {
    this.maps = new Map<TaskType, Map<TaskName, Task>>([
      [TaskType.Insights, new Map<TaskName, Task>()],
      [TaskType.Recommendations, new Map<TaskName, Task>()],
      [TaskType.Migrations, new Map<TaskName, Task>()],
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

  getTaskByTaskType(taskType: TaskType, taskName: TaskName): Task | undefined {
    let map = this.maps.get(taskType);

    return map!.get(taskName);
  }

  setTaskByTaskType(taskType: TaskType, taskName: TaskName, task: Task): void {
    let map = this.maps.get(taskType);

    map!.set(taskName, task);
  }

  getTasks(taskType: TaskType): Map<TaskName, Task> {
    return this.maps.get(taskType)!;
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
      this.maps.get(TaskType.Migrations)!.size +
      this.maps.get(TaskType.Insights)!.size +
      this.maps.get(TaskType.Recommendations)!.size
    );
  }
}
