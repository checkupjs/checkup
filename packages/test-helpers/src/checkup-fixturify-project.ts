import { join, resolve, dirname } from 'path';
import { execSync } from 'child_process';
import { CheckupConfig, mergeConfig, FilePathArray } from '@checkup/core';
import * as fixturify from 'fixturify';
import Project from 'fixturify-project';
import stringify from 'json-stable-stringify';
import type { PackageJson } from 'type-fest';
import { symlinkSync, mkdirpSync } from 'fs-extra';
import walkSync from 'walk-sync';

const ROOT = process.cwd();

/**
 * Creates a fixturify instance of a Checkup project.
 *
 * @class CheckupFixturifyProject
 * @augments {Project}
 */
export default class CheckupFixturifyProject extends Project {
  private _hasWritten: boolean = false;
  private _dirChanged: boolean = false;

  constructor(name: string, version?: string, cb?: (project: Project) => void) {
    super(name, version, cb);

    this.pkg = Object.assign({}, this.pkg, {
      license: 'MIT',
      description: 'Fake project',
      repository: 'http://fakerepo.com',
    });
  }

  write(dirJSON: fixturify.DirJSON) {
    Object.assign(this.files, dirJSON);
    this.writeSync();
  }

  writeSync() {
    super.writeSync();
    this._hasWritten = true;
  }

  symlinkPackage(source: string, target: string) {
    mkdirpSync(dirname(target));
    symlinkSync(source, target);
  }

  /**
   * Add a checkup config file to the project
   *
   * @memberof CheckupFixturifyProject
   * @param {CheckupConfig} config - a partial CheckupConfig to write to .checkuprc file
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

    execSync(cmd, { cwd, stdio: 'ignore' });
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
   * @param {PackageJson} packageJson - The project's package.json file
   * @memberof CheckupFixturifyProject
   */
  updatePackageJson(packageJson: PackageJson) {
    packageJson.name = this.name;

    this.pkg = packageJson;
  }

  get filePaths(): FilePathArray {
    if (this._hasWritten) {
      let allFiles = walkSync(this.baseDir, { directories: false, ignore: ['node_modules'] });
      return new FilePathArray(...resolveFilePaths(this.baseDir, allFiles));
    } else {
      throw new Error('You must call writeSync on your project before getting the file paths.');
    }
  }
}

/**
 * Resolves file paths from the basePath
 *
 * @param {string} baseDir - The base path to resolve the file paths from
 * @param {string[]} filePaths - An array of file paths
 * @returns {*}  {string[]} An array of file paths
 */
function resolveFilePaths(baseDir: string, filePaths: string[]): string[] {
  if (baseDir !== '.') {
    return filePaths.map((pathName: string) => {
      return join(resolve(baseDir), pathName);
    });
  }
  return filePaths;
}
