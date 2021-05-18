export interface DependencyInfo {
  packageName: string;
  packageVersion: string;
  type: 'dependency' | 'devDependency';
  startLine: number;
  startColumn: number;
}

export type Dependency = DependencyInfo & {
  latestVersion: string;
  installedVersion: string;
  wantedVersion: string;
  semverBump: string;
};
