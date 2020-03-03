import { Task } from '@checkup/core';
import Project = require('fixturify-project');

class PluginBuilder {
  pluginName: string;
  version: string;
  tasks: Map<string, Task>;

  constructor(pluginName: string, version: string = '0.0.0') {
    this.pluginName = pluginName;
    this.version = version;
    this.tasks = new Map();
  }

  addTask(taskName: string, task: Task) {
    this.tasks.set(taskName, task);
    return this;
  }

  build() {
    return new Plugin(this);
  }
}

/**
 * Allows for the creation of a mock checkup plugin to be consumed by a fixturify
 * project. Use {@link PluginBuilder} to build an immutable plugin instance.
 */
export default class Plugin {
  static PluginBuilder = PluginBuilder;
  readonly pluginName: string;
  readonly version: string;
  readonly tasks: Map<string, Task>;

  constructor(builder: PluginBuilder) {
    this.pluginName = builder.pluginName;
    this.version = builder.version;
    this.tasks = builder.tasks;
  }

  toProject() {
    return new Project(this.pluginName, this.version, pluginProject => {
      pluginProject.pkg.keywords = [];
      pluginProject.pkg.keywords.push('oclif-plugin');
      pluginProject.pkg.oclif = {
        hooks: {
          'register-tasks': './src/hooks/register-tasks',
        },
      };
      pluginProject.pkg.files = [];
      pluginProject.files.src = {
        hooks: {
          'register-tasks.js': `
          ${[...this.tasks.entries()]
            .map(
              ([taskName, task]) =>
                `class ${taskName} {
                  taskName = '${task.taskName}';
                  friendlyTaskName = '${task.friendlyTaskName}';
                  taskClassification = ${JSON.stringify(task.taskClassification, null, 2)};

                  ${task.run.toString()}
                }`
            )
            .join('\n\n')}
            const hook = async function ({ cliArguments, tasks }) {
              ${[...this.tasks.keys()]
                .map(taskName => `tasks.registerTask(new ${taskName}(cliArguments));`)
                .join('\n')}
            }
            exports.default = hook;
          `,
        },
      };
    });
  }
}
