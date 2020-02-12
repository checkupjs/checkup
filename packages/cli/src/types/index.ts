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

export interface ICommand extends IEmberCLICommand {
  name: string;
  aliases: string[];
  description: string;
  works: string;
  availableOptions: object[];
  run: (options: object) => {};
}

export interface IConsoleWriter {
  heading: (heading: string) => void;
  divider: () => void;
  text: (text: string) => void;
  indent: (spaces: number) => void;
  line: () => void;
  column: <T>(data: IDictionary<T>) => void;
  table: <T>(heading: string[] | string, dict: IDictionary<T>) => void;
  singleColumnTable: (heading: string, rowData: string[]) => void;
}

export interface IDependencyList {
  dependencies: IDictionary<string>;
  devDependencies: IDictionary<string>;
}

export interface IDictionary<T> {
  [key: string]: T;
}

export interface IEmberCLICommand {
  project?: any;
  ui?: any;
}

export interface IOptions {
  verbose?: boolean;
  silent?: boolean;
  json?: boolean;
  task?: string;
}

export interface ISearchTraverser<T> {
  hasResults: boolean;
  results: T;
  visitors: TraverseOptions | any;
  traverseAst: (filePath: string) => void;
  reset: () => void;
}

export interface ISpinner {
  title: string;
  start: () => void;
  stop: () => void;
}

export interface ITask {
  run: () => Promise<ITaskResult>;
}

export interface ITaskConstructor {
  new (): ITask;
}

export interface ITaskItemData {
  [propName: string]: string[];
}

export interface ITaskList {
  addTask: (task: ITaskConstructor) => void;
  addTasks: (tasks: ITaskConstructor[]) => void;
  runTasks: () => void;
}

export interface ITaskResult {
  toConsole: (writer: IConsoleWriter) => void;
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

export interface IUserInterface {
  writeLine: (line: string) => void;
  startProgress: (message: string) => void;
  stopProgress: () => void;
}

export type SearchPatterns = IDictionary<string[]>;
