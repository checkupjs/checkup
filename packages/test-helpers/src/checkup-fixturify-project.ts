'use strict';

import { CheckupConfig, mergeConfig, FilePathArray } from '@checkup/core';

import { PackageJson } from 'type-fest';
import Project from 'fixturify-project';
import { execSync } from 'child_process';
import { join, resolve } from 'path';
import stringify from 'json-stable-stringify';

const walkSync = require('walk-sync');

const ROOT = process.cwd();

/**
 * An extension of {@link Project} that adds methods specific to creating
 * mock checkup projects.
 */
export default class CheckupFixturifyProject extends Project {
  private _hasWritten: boolean = false;
  private _dirChanged: boolean = false;

  constructor(name: string, version?: string, cb?: (project: Project) => void, root?: string) {
    super(name, version, cb, root);

    this.pkg = Object.assign({}, this.pkg, {
      license: 'MIT',
      description: 'Fake project',
      repository: 'http://fakerepo.com',
    });
  }

  writeSync() {
    super.writeSync(...arguments);
    this._hasWritten = true;
  }
  /**
   * Add a checkup config file to the project
   *
   * @memberof CheckupFixturifyProject
   * @param config - a partial {@link CheckupConfig} to write to .checkuprc file
   */
  addCheckupConfig(config: Partial<CheckupConfig> = {}) {
    this.files['.checkuprc'] = stringify(mergeConfig(config));
    this.files['.eslintrc.js'] = '';

    this.writeSync();
  }

  /**
   * Initializes a git repository on the base directory of the project
   *
   * @memberof CheckupFixturifyProject
   */
  gitInit() {
    try {
      execSync(`git init -q ${this.baseDir}`);
    } catch {
      throw new Error("Couldn't initialize git repository.");
    }
  }

  install(cwd = this.baseDir) {
    let cmd: string = 'yarn install --silent';

    try {
      execSync(cmd, { cwd });
    } catch (error) {
      throw new Error(error);
    }
  }

  chdir() {
    this._dirChanged = true;

    // ensure the directory structure is created initially
    this.writeSync();

    process.chdir(this.baseDir);
  }

  dispose() {
    if (this._dirChanged) {
      process.chdir(ROOT);
    }

    return super.dispose();
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

  get filePaths(): FilePathArray {
    if (this._hasWritten) {
      let allFiles = walkSync(this.baseDir, { directories: false, ignore: ['node_modules'] });
      return new FilePathArray(...resolveFilePaths(allFiles, this.baseDir));
    } else {
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
