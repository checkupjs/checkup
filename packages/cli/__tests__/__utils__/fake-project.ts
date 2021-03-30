import { join, resolve } from 'path';
import * as helpers from 'yeoman-test';

import { CheckupProject } from '@checkup/test-helpers';
import { generatePlugin, generateTask } from './generator-utils';

import type { Answers } from 'inquirer';
import { mkdirp, symlink } from 'fs-extra';

export class FakeProject extends CheckupProject {
  async addPlugin(options: helpers.Dictionary<any> = {}, prompts: Answers = {}) {
    let pluginDir = await generatePlugin(options, prompts, join(this.baseDir, 'node_modules'));
    let coreDir = join(this.baseDir, 'node_modules', '@checkup', 'core');

    await mkdirp(coreDir);
    await symlink(coreDir, resolve('../../..', 'core'));

    return pluginDir;
  }

  async addTask(options: helpers.Dictionary<any> = {}, prompts: Answers = {}, pluginDir: string) {
    await generateTask(options, prompts, pluginDir);
  }
}
