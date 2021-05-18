import * as npmCheck from 'npm-check';
import { getPackageJsonSource } from '../utils/get-package-json';
import { Dependency, DependencyInfo } from '../types/dependency';
import JsonAnalyzer from './json-analyzer';

export type NpmCheckDependency = {
  moduleName: string;
  latest: string;
  installed: string;
  packageWanted: string;
  packageJson: string;
  devDependency: boolean;
  semverValid: string;
  bump: string;
};

export default class DependencyAnalyzer {
  _dependencies: Dependency[] = [];

  constructor(public baseDir: string) {}

  async analyze() {
    if (this._dependencies.length === 0) {
      let pkgDependencies = [...this.loadDependencies()];
      let outdatedDependencies = await this.loadOutdatedDependencies();

      this._dependencies = outdatedDependencies.map((dependency: NpmCheckDependency) => {
        let dependencyInfo = pkgDependencies.find(
          (depencencyInfo) => depencencyInfo.packageName === dependency.moduleName
        ) || {
          packageName: dependency.moduleName,
          packageVersion: dependency.packageJson,
          type: dependency.devDependency ? 'devDependency' : 'dependency',
          startLine: 0,
          startColumn: 0,
        };

        return {
          ...dependencyInfo,
          latestVersion: dependency.latest,
          installedVersion: dependency.installed,
          wantedVersion: dependency.packageWanted,
          semverBump: dependency.bump,
        };
      });
    }

    return this._dependencies;
  }

  async loadOutdatedDependencies(): Promise<NpmCheckDependency[]> {
    let result = await npmCheck({ cwd: this.baseDir });

    return result.get('packages');
  }

  loadDependencies() {
    class DependenciesAccumulator {
      dependencies: Set<DependencyInfo>;

      constructor() {
        this.dependencies = new Set();
      }

      get visitors() {
        let self = this;
        return {
          ObjectProperty(path: any) {
            let node: any = path.node;
            if (node.key.value === 'dependencies' && node.value.properties) {
              for (let property of node.value.properties) {
                self.dependencies.add({
                  packageName: property.key.value,
                  packageVersion: property.value.value,
                  type: 'dependency',
                  startLine: property.loc.start.line,
                  startColumn: property.loc.start.column,
                });
              }
            }
            if (node.key.value === 'devDependencies' && node.value.properties) {
              for (let property of node.value.properties) {
                self.dependencies.add({
                  packageName: property.key.value,
                  packageVersion: property.value.value,
                  type: 'devDependency',
                  startLine: property.loc.start.line,
                  startColumn: property.loc.start.column,
                });
              }
            }
          },
        };
      }
    }

    let dependencyAccumulator = new DependenciesAccumulator();
    let analyzer = new JsonAnalyzer(getPackageJsonSource(this.baseDir));

    analyzer.analyze(dependencyAccumulator.visitors);

    return dependencyAccumulator.dependencies;
  }
}
