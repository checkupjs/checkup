import { Category, Priority, Task } from '@checkup/core';

export function createMockTask(
  taskName: string,
  friendlyTaskName: string,
  category: Category,
  priority: Priority,
  result: object
) {
  return class MockTask implements Task {
    meta = {
      taskName,
      friendlyTaskName,
      taskClassification: {
        category,
        priority,
      },
    };

    async run() {
      return createMockTaskResult(taskName, friendlyTaskName, category, priority, result);
    }
  };
}

export function createMockTaskResult(
  taskName: string,
  friendlyTaskName: string,
  category: Category,
  priority: Priority,
  result: object
) {
  return {
    json() {
      if (category === 'meta') {
        return result;
      } else {
        return {
          meta: {
            taskName,
            friendlyTaskName,
            taskClassification: {
              category,
              priority,
            },
          },
          result,
        };
      }
    },
    stdout() {
      process.stdout.write(`${taskName} is being run\n`);
    },
    pdf() {
      return undefined;
    },
  };
}
