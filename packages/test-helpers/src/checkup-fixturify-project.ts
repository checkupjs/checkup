'use strict';
import { CheckupConfig } from '@checkup/core';
import Plugin from './plugin';
import FixturifyProject from 'fixturify-project';

/**
 * An extension of {@link Project} that adds methods specific to creating
 * mock checkup projects.
 */
export default class CheckupFixturifyProject extends FixturifyProject {
  constructor(name: string, version?: string, cb?: (project: any) => void, root?: string) {
    super(name, version, cb, root);
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
}
