import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

import { Class } from 'type-fest';
import { Task } from '@checkup/core';

import Project = require('fixturify-project');

const REGISTER_TASKS_TEMPLATE = fs.readFileSync(
  path.resolve(__dirname, 'static/templates/register-tasks.hbs'),
  'utf-8'
);
const template = Handlebars.compile(REGISTER_TASKS_TEMPLATE);

/**
 * Allows for the creation of a mock checkup plugin to be consumed by a fixturify
 * project.
 */
export default class Plugin {
  readonly pluginName: string;
  readonly version: string;
  readonly tasks: Set<Class<Task>>;

  constructor(pluginName: string, version: string = '0.0.0') {
    this.pluginName = pluginName;
    this.version = version;
    this.tasks = new Set<Class<Task>>();
  }

  addTask(task: Class<Task>) {
    this.tasks.add(task);
    return this;
  }

  toProject() {
    return new Project(this.pluginName, this.version, (pluginProject) => {
      pluginProject.pkg.keywords = [];
      pluginProject.pkg.keywords.push('oclif-plugin');
      pluginProject.pkg.oclif = {
        hooks: {
          'register-tasks': './lib/hooks/register-tasks',
        },
      };
      pluginProject.pkg.files = [];
      pluginProject.files.lib = {
        hooks: {
          'register-tasks.js': template({
            classes: [...this.tasks].map((task) => task.toString()),
            taskNames: [...this.tasks].map((task) => task.name),
          }),
        },
      };
    });
  }
}
