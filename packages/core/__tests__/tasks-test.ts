import { Task, TaskResult, getRegisteredTasks, registerTask, registerTasks } from '@checkup/core';

class TestTask implements Task {
  async run(): Promise<TaskResult> {
    return Promise.resolve({
      toConsole() {},
      toJson() {
        return {};
      },
    });
  }
}

class ChildTestTask extends TestTask {}

describe('@checkup/core tasks', () => {
  it('Returns no tasks if none have been registered', () => {
    expect(getRegisteredTasks()).toHaveLength(0);
  });

  it('Can add a single task via registerTask', () => {
    registerTask(TestTask);

    expect(getRegisteredTasks()).toHaveLength(1);
  });

  it('Can add multiple tasks via registerTasks', () => {
    registerTasks(TestTask, ChildTestTask);

    expect(getRegisteredTasks()).toHaveLength(2);
  });
});
