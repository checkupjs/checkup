export interface HooksConfig {
  registerTask(taskName: string, task: TaskConstructor): void;
}

export interface TaskConfig {}

export interface CheckupConfig {
  plugins: string[];
  tasks: Record<string, TaskConfig>;
}

export type TaskName = string;

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
