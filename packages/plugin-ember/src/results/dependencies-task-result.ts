import { TaskResult, toPairs, ui } from '@checkup/core';

import { DependenciesTask } from '../tasks';
import { PackageJson } from 'type-fest';

export default class DependenciesTaskResult implements TaskResult {
  emberLibraries!: PackageJson.Dependency;
  emberAddons!: Record<string, PackageJson.Dependency>;
  emberCliAddons!: Record<string, PackageJson.Dependency>;

  constructor() {
    this.emberLibraries = {};
  }

  get hasDependencies() {
    return (
      Object.keys(this.emberLibraries).length ||
      [this.emberAddons, this.emberCliAddons].every(addons => {
        return Object.keys(addons.dependencies).length && Object.keys(addons.devDependencies);
      })
    );
  }

  toConsole() {
    if (!this.hasDependencies) {
      return;
    }
    ui.styledHeader(DependenciesTask.friendlyTaskName);
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

  toJson() {
    return {
      [DependenciesTask.taskName]: {
        emberLibraries: this.emberLibraries,
        emberAddons: this.emberAddons,
        emberCliAddons: this.emberCliAddons,
      },
    };
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
