import * as helpers from 'yeoman-test';

import { Answers } from 'inquirer';
import { join } from 'path';
import { createTmpDir } from '@checkup/test-helpers';
import PluginGenerator from '../../src/generators/plugin';
import TaskGenerator from '../../src/generators/task';

const DEFAULT_PLUGIN_OPTIONS = {
  name: 'my-plugin',
  defaults: true,
};

const DEFAULT_PLUGIN_PROMPTS = {
  typescript: true,
  description: '',
  author: '',
  repository: '',
};

const DEFAULT_TASK_OPTIONS = {
  name: 'my-task',
  path: '.',
  defaults: true,
};

const DEFAULT_TASK_PROMPTS = {
  typescript: true,
  category: 'best practices',
  group: '',
};

export async function generatePlugin(
  options: helpers.Dictionary<any> = {},
  prompts: Answers = {},
  tmp: string = createTmpDir()
) {
  let mergedOptions = Object.assign({ path: '.' }, DEFAULT_PLUGIN_OPTIONS, options);
  let mergedPrompts = Object.assign({}, DEFAULT_PLUGIN_PROMPTS, prompts);
  let dir = await helpers
    .run(PluginGenerator, { namespace: 'checkup:plugin' })
    .cd(tmp)
    .withOptions(mergedOptions)
    .withPrompts(mergedPrompts);

  return options.path
    ? join(dir, options.path, `checkup-plugin-${mergedOptions.name}`)
    : join(dir, `checkup-plugin-${mergedOptions.name}`);
}

export async function generateTask(
  options: helpers.Dictionary<any> = {},
  prompts: Answers = {},
  tmp: string = createTmpDir()
) {
  let mergedOptions = Object.assign({}, DEFAULT_TASK_OPTIONS, options);
  let mergedPrompts = Object.assign({}, DEFAULT_TASK_PROMPTS, prompts);

  return await helpers
    .run(TaskGenerator, { namespace: 'checkup:task' })
    .cd(tmp)
    .withOptions(mergedOptions)
    .withPrompts(mergedPrompts);
}
