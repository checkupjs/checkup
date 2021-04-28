import { join } from 'path';
import * as helpers from 'yeoman-test';

import { CheckupProject } from '@checkup/test-helpers';

import type { Answers } from 'inquirer';
import { generatePlugin, generateTask } from './generator-utils';

export class FakeProject extends CheckupProject {
  async addPlugin(options: helpers.Dictionary<any> = {}, prompts: Answers = {}) {
    let pluginDir = await generatePlugin(options, prompts, join(this.baseDir, 'node_modules'));
    let source = join(__dirname, '../../..', 'core');
    let target = join(pluginDir, 'node_modules', '@checkup', 'core');

    // we create a self-referential link to the core package within the generated plugin. This
    // allows us to generate plugins, and test the APIs for the latest version of core that is
    // referenced via the plugins' node_modules.
    this.symlinkPackage(source, target);

    return pluginDir;
  }

  async addTask(options: helpers.Dictionary<any> = {}, prompts: Answers = {}, pluginDir: string) {
    await generateTask(options, prompts, pluginDir);
  }
}
