import { BaseTaskResult, TableData, TaskMetaData, TaskResult, toPairs, ui } from '@checkup/core';

import { PackageJson } from 'type-fest';

export default class EmberDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  emberLibraries!: PackageJson.Dependency;
  emberAddons!: Record<string, PackageJson.Dependency>;
  emberCliAddons!: Record<string, PackageJson.Dependency>;

  constructor(meta: TaskMetaData) {
    super(meta);
    this.emberLibraries = {};
  }

  get hasDependencies() {
    return (
      Object.keys(this.emberLibraries).length ||
      [this.emberAddons, this.emberCliAddons].every((addons) => {
        return (
          Object.keys(addons.dependencies).length && Object.keys(addons.devDependencies).length
        );
      })
    );
  }

  stdout() {
    if (!this.hasDependencies) {
      return;
    }

    this._writeDependencySection('Ember Core Libraries', this.emberLibraries);
    this._writeDependencySection(
      `Ember Addons | ${this.emberAddons.dependencies.length} dependencies`,
      this.emberAddons.dependencies
    );
    this._writeDependencySection(
      `Ember Addons | ${this.emberAddons.devDependencies.length} devDependencies`,
      this.emberAddons.devDependencies
    );
    this._writeDependencySection(
      `Ember CLI Addons ${this.emberCliAddons.dependencies.length} dependencies`,
      this.emberCliAddons.dependencies
    );
    this._writeDependencySection(
      `Ember CLI Addons | ${this.emberCliAddons.devDependencies.length} devDependencies`,
      this.emberCliAddons.devDependencies
    );
  }

  json() {
    return {
      meta: this.meta,
      result: {
        emberLibraries: this.emberLibraries,
        emberAddons: this.emberAddons,
        emberCliAddons: this.emberCliAddons,
      },
    };
  }

  html() {
    let dependencyGroups = [
      this.emberLibraries,
      this.emberAddons.devDependencies,
      this.emberAddons.dependencies,
      this.emberCliAddons.dependencies,
      this.emberCliAddons.devDependencies,
    ];

    return dependencyGroups
      .map((dependencyGroup) => this._createTableData(dependencyGroup))
      .filter((item) => item !== undefined) as TableData[];
  }

  _createTableData(dependencyGroup: PackageJson.Dependency): TableData | undefined {
    if (Object.keys(dependencyGroup).length === 0) {
      return;
    }

    return new TableData(
      this.meta,
      Object.entries(dependencyGroup).map((dependency) => ({
        name: dependency[0],
        value: dependency[1],
      }))
    );
  }

  _writeDependencySection(header: string, dependencies: PackageJson.Dependency) {
    let total = Object.keys(dependencies).length;

    if (total === 0) {
      return;
    }

    ui.subSection(`${header} | Total: ${total}`, () => {
      ui.table(toPairs(dependencies, { keyName: 'dependency', valueName: 'version' }), {
        dependency: {},
        version: {},
      });
    });
  }
}
