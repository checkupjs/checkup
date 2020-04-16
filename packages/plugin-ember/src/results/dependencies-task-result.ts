import {
  BaseTaskResult,
  TaskMetaData,
  TaskResult,
  toPairs,
  ui,
  NumericalCardData,
} from '@checkup/core';

import { PackageJson } from 'type-fest';

export default class DependenciesTaskResult extends BaseTaskResult implements TaskResult {
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
        return Object.keys(addons.dependencies).length && Object.keys(addons.devDependencies);
      })
    );
  }

  stdout() {
    if (!this.hasDependencies) {
      return;
    }
    ui.styledHeader(this.meta.friendlyTaskName);
    this._writeDependencySection('Dependencies - Core Libraries', this.emberLibraries);
    this._writeDependencySection('Dependencies - Ember Addons', this.emberAddons.dependencies);
    this._writeDependencySection(
      'Dev Dependencies - Ember Addons',
      this.emberAddons.devDependencies
    );
    this._writeDependencySection(
      'Dependencies - Ember CLI Addons',
      this.emberCliAddons.dependencies
    );
    this._writeDependencySection(
      'Dev Dependencies - Ember CLI Addons',
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

  pdf() {
    // TODO: add in correct data type for DependenciesTaskResult
    return new NumericalCardData(this.meta, 22, 'this is a description of your result');
  }

  _writeDependencySection(header: string, dependencies: PackageJson.Dependency) {
    if (Object.keys(dependencies).length === 0) {
      return;
    }

    ui.styledHeader(header);
    ui.blankLine();
    ui.table(toPairs(dependencies, { keyName: 'dependency', valueName: 'version' }), {
      dependency: {},
      version: {},
    });
    ui.blankLine();
  }
}
