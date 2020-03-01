'use strict';

import { CheckupConfig } from '@checkup/core';
import FixturifyProject from 'fixturify-project';
import { PackageJson } from 'type-fest';
import Plugin from './plugin';
import { execSync } from 'child_process';

/**
 * An extension of {@link Project} that adds methods specific to creating
 * mock checkup projects.
 */
export default class CheckupFixturifyProject extends FixturifyProject {
  constructor(name: string, version?: string, callback?: (project: any) => void, root?: string) {
    super(name, version, callback, root);
  }

  /**
   * Add a checkup config file to the project
   * @param config - a partial {@link CheckupConfig} to write to .checkuprc file
   */
  addCheckupConfig(config: Partial<CheckupConfig>) {
    const defaultConfig: CheckupConfig = { plugins: [], tasks: {} };
    this.files['.checkuprc'] = JSON.stringify(Object.assign(defaultConfig, config));
    return this;
  }

  /**
   * Add a plugin to the checkup project
   * @param plugin - a {@link Plugin} to add as a dependency to the project
   */
  addPlugin(plugin: Plugin) {
    this.addDevDependency(plugin.toProject());
    return this;
  }

  gitInit() {
    try {
      execSync(`git init -q ${this.baseDir}`);
    } catch (error) {
      throw new Error("Couldn't initialize git repository.");
    }
  }

  updatePackageJson(packageJsonContent: PackageJson) {
    packageJsonContent.name = this.name;

    this.pkg = packageJsonContent;
  }
}
