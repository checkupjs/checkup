import { ITaskResult } from '../types';
import { PackageJson } from 'type-fest';
import { ui } from '../utils/ui';

export default class DependenciesTaskResult implements ITaskResult {
  emberLibraries!: PackageJson.Dependency;
  emberAddons!: Record<string, PackageJson.Dependency>;
  emberCliAddons!: Record<string, PackageJson.Dependency>;

  constructor() {
    this.emberLibraries = {};
  }

  get hasDependencies() {
    return [this.emberAddons, this.emberCliAddons].every(addons => {
      return Object.keys(addons.dependencies).length && Object.keys(addons.devDependencies);
    });
  }

  toConsole() {
    if (!this.hasDependencies) {
      return;
    }

    ui.styledHeader('Dependencies');
    ui.blankLine();
    // writer.table('Ember Core Libraries', this.emberLibraries);
    // writer.line();

    // writer.table('Ember Addons - dependencies', this.emberAddons.dependencies);
    // writer.table('Ember Addons - devDependencies', this.emberAddons.dependencies);
    // writer.table('Ember CLI Addons - dependencies', this.emberCliAddons.dependencies);
    // writer.table('Ember CLI Addons - devDependencies', this.emberCliAddons.dependencies);
    // writer.line();
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
}
