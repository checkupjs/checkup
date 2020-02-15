export default {};

export const enum ProjectType {
  App = 'application',
  Addon = 'addon',
  Engine = 'engine',
  Unknown = 'unknown',
}

export const enum TestType {
  Application = 'application',
  Container = 'container',
  Rendering = 'rendering',
  Unit = 'unit',
}

export interface Task {
  run: () => Promise<TaskResult>;
}

export interface TaskConstructor {
  new (): Task;
}

export interface TaskItemData {
  type: string;
  data: string[];
  total: number;
}

export interface TaskResult {
  toConsole: () => void;
  toJson: () => {};
}

export type SearchPatterns = Record<string, string[]>;
