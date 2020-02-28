import { TaskConstructor, TaskName } from '@checkup/core';

export default function sortTasks(tasks: Map<TaskName, TaskConstructor>): TaskConstructor[] {
  return Array.from(tasks.entries())
    .sort(([taskNameA], [taskNameB]) => {
      if (taskNameA < taskNameB) {
        return -1;
      }

      if (taskNameA > taskNameB) {
        return -1;
      }

      return 0;
    })
    .map(([, TaskConstructor]) => TaskConstructor);
}
