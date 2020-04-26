import { BaseTaskResult, TableData, TaskMetaData, TaskResult, toPairs, ui } from '@checkup/core';

import { PackageJson } from 'type-fest';

function getLength(dependencies: PackageJson.Dependency): number {
  return Object.keys(dependencies).length;
}

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
        return getLength(addons.dependencies) && getLength(addons.devDependencies);
      })
    );
  }

  stdout() {
    if (!this.hasDependencies) {
      return;
    }

    this._writeDependencySection('Ember Core Libraries', this.emberLibraries);
    this._writeDependencySection(
      `Ember Addons | ${getLength(this.emberAddons.dependencies)} dependencies`,
      this.emberAddons.dependencies
    );
    this._writeDependencySection(
      `Ember Addons | ${getLength(this.emberAddons.devDependencies)} devDependencies`,
      this.emberAddons.devDependencies
    );
    this._writeDependencySection(
      `Ember CLI Addons ${getLength(this.emberCliAddons.dependencies)} dependencies`,
      this.emberCliAddons.dependencies
    );
    this._writeDependencySection(
      `Ember CLI Addons | ${getLength(this.emberCliAddons.devDependencies)} devDependencies`,
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
    if (getLength(dependencyGroup) === 0) {
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
    let total = getLength(dependencies);

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
