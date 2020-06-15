import * as debug from 'debug';

import { TaskContext, TaskIdentifier, TaskMetaData } from './types/tasks';

import { TaskConfig } from './types/config';
import { getShorthandName } from './utils/plugin-name';

export default abstract class BaseTask {
  context: TaskContext;
  meta!: TaskMetaData | TaskIdentifier;
  debug: debug.Debugger;

  #pluginName: string;
  #config!: TaskConfig;
  #enabled!: string;

  constructor(pluginName: string, context: TaskContext) {
    this.#pluginName = getShorthandName(pluginName);
    this.context = context;

    this.debug = debug('checkup:task');

    this.debug('%s created', this.constructor.name);
  }

  get config() {
    this._parseConfig();

    return this.#config;
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

    this.debug('%s enabled: %s', this.constructor.name, this.#enabled);
    this.debug('%s task config: %o', this.constructor.name, this.#config);
  }
}
