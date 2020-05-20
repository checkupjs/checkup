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
  skip: number;
  only: number;
  todo: number;
  test: number;
  total: number;
  percentageSkipped: string;
  type: TestType;
}
