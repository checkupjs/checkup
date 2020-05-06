export const enum ProjectType {
  App = 'application',
  Addon = 'addon',
  Engine = 'engine',
  Unknown = 'unknown',
}

export enum TestType {
  Application = 'application',
  Rendering = 'rendering',
  Unit = 'unit',
}

export interface TestTypeInfo {
  skips: number;
  onlys: number;
  todos: number;
  tests: number;
  total: number;
  percentageSkipped: string;
  type: TestType;
}
