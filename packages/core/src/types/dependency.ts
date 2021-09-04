export interface DependencyInfo {
  packageName: string;
  packageVersion: string;
  type: 'dependency' | 'devDependency';
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export type Dependency = DependencyInfo & {
  latestVersion: string;
  installedVersion: string;
  wantedVersion: string;
  semverBump: string;
};
