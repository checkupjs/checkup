import { TraverseOptions } from '@babel/traverse';

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

export interface IDependencyList {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface ISearchTraverser<T> {
  hasResults: boolean;
  results: T;
  visitors: TraverseOptions | any;
  traverseAst: (filePath: string) => void;
  reset: () => void;
}

export interface ITask {
  run: () => Promise<ITaskResult>;
}

export interface ITaskConstructor {
  new (): ITask;
}

export interface ITaskItemData {
  type: string;
  data: string[];
  total: number;
}

export interface ITaskList {
  addTask: (task: ITaskConstructor) => void;
  addTasks: (tasks: ITaskConstructor[]) => void;
  runTasks: () => void;
}

export interface ITaskResult {
  toConsole: () => void;
  toJson: () => {};
}

export interface ITestMetrics {
  moduleCount: number;
  skipCount: number;
  testCount: number;
}

export interface ITestTaskResultData {
  application: ITestMetrics;
  container: ITestMetrics;
  rendering: ITestMetrics;
  unit: ITestMetrics;
}

export type SearchPatterns = Record<string, string[]>;
