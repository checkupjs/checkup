import { ITaskResult } from '../types';
import { PackageJson } from 'type-fest';
import { ui } from '../utils/ui';
import { wrapEntries } from '../utils/data-formatter';

export default class DependenciesTaskResult implements ITaskResult {
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

    this._writeDependencySection('Dependencies - Core Libraries', this.emberLibraries);
    this._writeDependencySection('Dependencies - Ember Addons', this.emberAddons.dependencies);
    this._writeDependencySection('Dependencies - Ember Addons', this.emberAddons.devDependencies);
    this._writeDependencySection('Dependencies - Ember Addons', this.emberCliAddons.dependencies);
    this._writeDependencySection(
      'Dependencies - Ember Addons',
      this.emberCliAddons.devDependencies
    );
  }

  toJson() {
    return {
      dependencies: {
        emberLibraries: this.emberLibraries,
        emberAddons: this.emberAddons,
        emberCliAddons: this.emberCliAddons,
      },
    };
  }

  _writeDependencySection(header: string, dependencies: PackageJson.Dependency) {
    if (!Object.keys(dependencies).length) {
      return;
    }

    ui.styledHeader(header);
    ui.blankLine();
    ui.table(wrapEntries(dependencies, { keyName: 'dependency', valueName: 'version' }), {
      dependency: {},
      version: {},
    });
    ui.blankLine();
  }
}
