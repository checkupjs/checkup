import { ITaskResult, IConsoleWriter, IDependencyList, IDictionary } from '../types';

export default class DependenciesTaskResult implements ITaskResult {
  emberLibraries!: IDictionary<string>;
  emberAddons!: IDependencyList;
  emberCliAddons!: IDependencyList;

  constructor() {
    this.emberLibraries = {};
  }

  get hasDependencies() {
    return [this.emberAddons, this.emberCliAddons].every(addons => {
      return Object.keys(addons.dependencies).length && Object.keys(addons.devDependencies);
    });
  }

  toConsole(writer: IConsoleWriter) {
    if (!this.hasDependencies) {
      return;
    }

    writer.heading('Dependencies');
    writer.table('Ember Core Libraries', this.emberLibraries);
    writer.line();

    writer.table('Ember Addons - dependencies', this.emberAddons.dependencies);
    writer.table('Ember Addons - devDependencies', this.emberAddons.dependencies);
    writer.table('Ember CLI Addons - dependencies', this.emberCliAddons.dependencies);
    writer.table('Ember CLI Addons - devDependencies', this.emberCliAddons.dependencies);
    writer.line();
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
