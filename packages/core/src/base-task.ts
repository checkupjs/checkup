import * as debug from 'debug';

import { TaskName, TaskContext2 } from './types/tasks';

import { TaskConfig, ConfigValue } from './types/config';
import { getShorthandName } from './utils/plugin-name';
import { parseConfigTuple } from './config';
export default abstract class BaseTask {
  abstract taskName: TaskName;
  abstract taskDisplayName: string;
  abstract category: string;
  group?: string;
  context: TaskContext2;
  debug: debug.Debugger;

  _pluginName: string;
  _config!: TaskConfig;
  _enabled!: boolean;
  _enabledViaConfig!: boolean;

  constructor(pluginName: string, context: TaskContext2) {
    this._pluginName = getShorthandName(pluginName);
    this.context = context;

    this.debug = debug('checkup:task');
  }

  get config() {
    this._parseConfig();

    return this._config;
  }

  get enabled() {
    if (this._enabled === undefined) {
      this._parseConfig();
      let enabledViaFlag =
        this.context.options.tasks?.includes(this.fullyQualifiedTaskName) || false;
      let enabled = this._enabledViaConfig || enabledViaFlag;

      this.debug('%s enabled: %s', this.fullyQualifiedTaskName, enabled);

      this._enabled = enabled;
    }

    return this._enabled;
  }

  get fullyQualifiedTaskName() {
    return `${this._pluginName}/${this.taskName}`;
  }

  private _parseConfig() {
    if (this._config) {
      return;
    }

    let config: ConfigValue<TaskConfig> | undefined = this.context.config.tasks[
      this.fullyQualifiedTaskName
    ];

    let [enabled, taskConfig] = parseConfigTuple<TaskConfig>(config);

    this._enabledViaConfig = enabled;
    this._config = taskConfig;

    this.debug('%s task config: %O', this.fullyQualifiedTaskName, this._config);
  }
}
