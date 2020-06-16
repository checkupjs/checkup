import * as debug from 'debug';

import { TaskContext, TaskIdentifier, TaskMetaData } from './types/tasks';

import { TaskConfig } from './types/config';
import { getShorthandName } from './utils/plugin-name';

export default abstract class BaseTask {
  context: TaskContext;
  meta!: TaskMetaData | TaskIdentifier;

  #pluginName: string;
  #config!: TaskConfig;
  #enabled!: string;

  constructor(pluginName: string, context: TaskContext) {
    this.#pluginName = getShorthandName(pluginName);
    this.context = context;
  }

  get config() {
    this._parseConfig();

    return this.#config;
  }

  get debugTask() {
    return debug(`checkup:task:${this.meta?.taskName}-task`);
  }

  get enabled() {
    this._parseConfig();

    return this.#enabled === 'on';
  }

  private get fullyQualifiedTaskName() {
    return `${this.#pluginName}/${this.meta.taskName}`;
  }

  private _parseConfig() {
    if (this.#config) {
      return;
    }

    let config: 'on' | 'off' | ['on' | 'off', TaskConfig] | undefined = this.context.config.tasks[
      this.fullyQualifiedTaskName
    ];

    this.#enabled = 'on';

    if (typeof config === 'string') {
      this.#enabled = config;
    } else if (Array.isArray(config)) {
      let [enabled, taskConfig] = config;

      this.#enabled = enabled;
      this.#config = taskConfig;
    }

    this.debugTask(`Task enabled: ${this.#enabled}, task config: ${this.#config}`);
  }
}
