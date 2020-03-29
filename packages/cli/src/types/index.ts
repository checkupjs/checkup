export default {};

export const enum TestType {
  Application = 'application',
  Container = 'container',
  Rendering = 'rendering',
  Unit = 'unit',
}

export type RepositoryInfo = {
  totalCommits: number;
  totalFiles: number;
  age: string;
  activeDays: string;
};
