'use strict';

import { PackageJson } from 'type-fest';
import CheckupFixturifyProject from './checkup-fixturify-project.js';

const enum InRepoPackageType {
  Addon = 'addon',
  Engine = 'engine',
}

type IndexablePackageJson = PackageJson & { [key: string]: any };

const Project = require('fixturify-project');

/**
 * @param {any} addon - The addon to create the standardized addon structure for
 */
function prepareAddon(addon: any) {
  addon.pkg.keywords.push('ember-addon');
  addon.pkg['ember-addon'] = {};
  addon.files['index.js'] = 'module.exports = { name: require("./package").name };';
}

/**
 * An extension of {@link CheckupFixturifyProject} that adds methods specific to creating
 * mock Ember projects.
 *
 * @class EmberCLIFixturifyProject
 * @augments {CheckupFixturifyProject}
 */
export default class EmberCLIFixturifyProject extends CheckupFixturifyProject {
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
    this.createPackage(name, version, InRepoPackageType.Addon);
  }

  addInRepoEngine(name: string, version = '0.0.0') {
    this.createPackage(name, version, InRepoPackageType.Engine);
  }

  private createPackage(name: string, version = '0.0.0', type: InRepoPackageType) {
    const inRepoPackage = new Project(name, version, (project: any) => {
      project.pkg.keywords.push('ember-addon');
      if (type === InRepoPackageType.Engine) {
        project.pkg.keywords.push('ember-engine');
      }
      project.pkg['ember-addon'] = {};
      project.files['index.js'] = 'module.exports = { name: require("./package").name };';
    });
    // configure the current project to have an ember-addon configured at the appropriate path
    let addon: any = ((<IndexablePackageJson>this.pkg)['ember-addon'] =
      (<IndexablePackageJson>this.pkg)['ember-addon'] || {});
    addon.paths = addon.paths || [];
    const addonPath = `lib/${name}`;

    if (addon.paths.some((path: string) => path.toLowerCase() === addonPath.toLowerCase())) {
      throw new Error(`project: ${this.name} already contains the in-repo-addon: ${name}`);
    }

    addon.paths.push(addonPath);

    this.files.lib = this.files.lib || {};

    // insert inRepoAddon into files
    Object.assign(this.files.lib, inRepoPackage.toJSON());
  }
}
