export interface Task {
  run: () => Promise<TaskResult>;
}

export interface TaskConstructor {
  new (): Task;
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
