'use strict';

import { JsonObject } from 'type-fest';

const FixturifyProject = require('fixturify-project');
const rimraf = require('rimraf');

function prepareAddon(addon: any) {
  addon.pkg.keywords.push('ember-addon');
  addon.pkg['ember-addon'] = {};
  addon.files['index.js'] = 'module.exports = { name: require("./package").name };';
}

export default class EmberCLIFixturifyProject extends FixturifyProject {
  constructor(name: string, version = '0.0.0', callback?: (project: any) => void, root?: string) {
    super(name, version, callback, root);
  }
  writeSync(...arguments_: any[]) {
    super.writeSync(...arguments_);
    this._hasWritten = true;
  }

  addAddon(name: string, version = '0.0.0') {
    return this.addDependency(name, version, (addon: any) => {
      prepareAddon(addon);
    });
  }

  addDevAddon(name: string, version = '0.0.0') {
    return this.addDevDependency(name, version, (addon: any) => {
      prepareAddon(addon);
    });
  }

  addInRepoAddon(name: string, version = '0.0.0') {
    const inRepoAddon = new FixturifyProject(name, version, (project: any) => {
      project.pkg.keywords.push('ember-addon');
      project.pkg['ember-addon'] = {};
      project.files['index.js'] = 'module.exports = { name: require("./package").name };';
    });

    // configure the current project to have an ember-addon configured at the appropriate path
    let addon = (this.pkg['ember-addon'] = this.pkg['ember-addon'] || {});
    addon.paths = addon.paths || [];
    const addonPath = `lib/${name}`;

    if (addon.paths.find((path: string) => path.toLowerCase() === addonPath.toLowerCase())) {
      throw new Error(`project: ${this.name} already contains the in-repo-addon: ${name}`);
    }

    addon.paths.push(addonPath);

    this.files.lib = this.files.lib || {};

    // insert inRepoAddon into files
    Object.assign(this.files.lib, inRepoAddon.toJSON());
  }

  updatePackageJson(packageContent: JsonObject) {
    packageContent.name = this.name;

    this.pkg = packageContent;
  }

  dispose(temporaryFilesToCleanupPath: string = '') {
    super.dispose();

    if (temporaryFilesToCleanupPath) {
      rimraf.sync(temporaryFilesToCleanupPath);
    }
  }
}
