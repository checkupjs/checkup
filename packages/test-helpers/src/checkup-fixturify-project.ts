'use strict';

import { CheckupConfig } from '@checkup/core';
import { PackageJson } from 'type-fest';
import Plugin from './plugin';
import Project from 'fixturify-project';
import { execSync } from 'child_process';
import { existsSync } from 'fs-extra';
import { join } from 'path';

/**
 * An extension of {@link Project} that adds methods specific to creating
 * mock checkup projects.
 */
export default class CheckupFixturifyProject extends Project {
  /**
   * Add a checkup config file to the project
   *
   * @memberof CheckupFixturifyProject
   * @param config - a partial {@link CheckupConfig} to write to .checkuprc file
   */
  addCheckupConfig(config: Partial<CheckupConfig>) {
    const defaultConfig: CheckupConfig = { plugins: [], tasks: {} };
    this.files['.checkuprc'] = JSON.stringify(Object.assign(defaultConfig, config));
    return this;
  }

  /**
   * Add a plugin to the checkup project
   *
   * @memberof CheckupFixturifyProject
   * @param plugin - a {@link Plugin} to add as a dependency to the project
   */
  addPlugin(plugin: Plugin) {
    this.addDevDependency(plugin.toProject());
    return this;
  }

  /**
   * Initializes a git repository on the base directory of the project
   *
   * @memberof CheckupFixturifyProject
   */
  gitInit() {
    try {
      execSync(`git init -q ${this.baseDir}`);
    } catch (error) {
      throw new Error("Couldn't initialize git repository.");
    }
  }

  install() {
    let cmd: string;

    if (existsSync(join(this.baseDir, 'yarn.lock'))) {
      cmd = 'yarn install';
    } else {
      cmd = 'npm install';
    }

    try {
      execSync(cmd, { cwd: this.baseDir });
    } catch (error) {
      throw new Error(`Couldn't install dependencies using ${cmd}`);
    }
  }

  /**
   * Updates the contents of the package.json file.
   *
   * @param {PackageJson} packageJsonContent
   * @memberof CheckupFixturifyProject
   */
  updatePackageJson(packageJsonContent: PackageJson) {
    packageJsonContent.name = this.name;

    this.pkg = packageJsonContent;
  }
}
