import * as npmCheck from 'npm-check';
import { Visitor } from 'ast-types';
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

/**
 * A class for analyzing Dependencies in a package.json
 *
 * @export
 * @class DependencyAnalyzer
 */
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
          endLine: 0,
          endColumn: 0,
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
    let result = await npmCheck({ cwd: this.baseDir, skipUnused: true });

    return result.get('packages');
  }

  loadDependencies() {
    class DependenciesAccumulator {
      dependencies: Set<DependencyInfo>;

      constructor() {
        this.dependencies = new Set();
      }

      get visitors(): Visitor<any> {
        let self = this;

        return {
          visitObjectProperty: function (path: any) {
            let node: any = path.node;
            if (node.key.value === 'dependencies' && node.value.properties) {
              for (let property of node.value.properties) {
                self.dependencies.add({
                  packageName: property.key.value,
                  packageVersion: property.value.value,
                  type: 'dependency',
                  startLine: property.loc.start.line,
                  startColumn: property.loc.start.column,
                  endLine: property.loc.end.line,
                  endColumn: property.loc.end.column,
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
                  endLine: property.loc.end.line,
                  endColumn: property.loc.end.column,
                });
              }
            }

            this.traverse(path);
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
