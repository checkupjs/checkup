import * as debug from 'debug';

import { TaskContext, TaskIdentifier, TaskMetaData } from './types/tasks';

import { TaskConfig } from './types/configuration';

export default abstract class BaseTask {
  context: TaskContext;
  meta!: TaskMetaData | TaskIdentifier;
  debug: debug.Debugger;

  private #config: unknown;
  private #enabled: string;

  constructor(context: TaskContext) {
    this.context = context;

    this.debug = debug('checkup:task');

    this.debug('%s %s', this.constructor.name, 'created');
  }

  private _parseConfig() {
    if (this._config) {
      return;
    }

    let config: TaskConfig | undefined = this.context.config.tasks[this.meta.taskName];

    this._config = {};
    this._enabled = 'on';

    if (typeof config === 'string') {
      this._enabled = config;
    } else if (Array.isArray(config)) {
      let [enabled, taskConfig] = config;

      this._enabled = enabled;
      this._config = taskConfig;
    }
  }

  get config() {
    this._parseConfig();

    return this._config;
  }

  get enabled() {
    this._parseConfig();

    return this._enabled === 'on';
  }
}
