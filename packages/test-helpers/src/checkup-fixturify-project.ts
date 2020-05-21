'use strict';

import { CheckupConfig, mergeConfig } from '@checkup/core';

import { PackageJson } from 'type-fest';
import Plugin from './plugin';
import Project from 'fixturify-project';
import { execSync } from 'child_process';
import { existsSync } from 'fs-extra';
import { join, resolve } from 'path';
import stringify from 'json-stable-stringify';

const walkSync = require('walk-sync');

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
  addCheckupConfig(config: Partial<CheckupConfig> = {}) {
    this.files['.checkuprc'] = stringify(mergeConfig(config));
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

  getFilePaths(): string[] {
    try {
      this.readSync(this.root);
      let allFiles = walkSync(this.baseDir, { directories: false });
      return resolveFilePaths(allFiles, this.baseDir);
    } catch (error) {
      throw new Error('You must call writeSync on your project before getting the file paths.');
    }
  }
}

function resolveFilePaths(filePaths: string[], basePath: string): string[] {
  if (basePath !== '.') {
    return filePaths.map((pathName: string) => {
      return join(resolve(basePath), pathName);
    });
  }
  return filePaths;
}
