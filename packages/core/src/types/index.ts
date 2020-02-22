export interface Task {
  run: () => Promise<TaskResult>;
}

export interface TaskConstructor {
  new (args: any): Task;
}

export interface TaskResult {
  toConsole: () => void;
  toJson: () => {};
}

export interface TaskItemData {
  type: string;
  data: string[];
  total: number;
}

export type SearchPatterns = Record<string, string[]>;

export interface TaskConfig {}

export interface CheckupConfig {
  // an object from task name to task configuration
  tasks: Record<string, TaskConfig>;
}
