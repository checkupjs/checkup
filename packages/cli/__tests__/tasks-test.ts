import { Task, TaskResult } from '@checkup/core';
import { getRegisteredTasks, registerTask } from '../src/tasks';

class TestTask implements Task {
  static taskName: string = 'Test';

  async run(): Promise<TaskResult> {
    return Promise.resolve({
      toConsole() {},
      toJson() {
        return {};
      },
    });
  }
}

describe('@checkup/core tasks', () => {
  it('Returns no tasks if none have been registered', () => {
    expect([...getRegisteredTasks().keys()]).toHaveLength(0);
  });

  it('Can add a single task via registerTask', () => {
    registerTask(TestTask.taskName, TestTask);

    expect([...getRegisteredTasks().keys()]).toHaveLength(1);
  });
});
