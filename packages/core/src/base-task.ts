import * as debug from 'debug';

import { TaskContext, TaskName } from './types/tasks';

import { TaskConfig, ConfigValue } from './types/config';
import { getShorthandName } from './utils/plugin-name';
import { parseConfigTuple } from './config';

import { Result } from 'sarif';

export default abstract class BaseTask {
  abstract taskName: TaskName;
  abstract taskDisplayName: string;
  abstract category: string;
  group?: string;
  context: TaskContext;
  debug: debug.Debugger;

  _pluginName: string;
  _config!: TaskConfig;
  _enabledViaConfig!: boolean;

  constructor(pluginName: string, context: TaskContext) {
    this._pluginName = getShorthandName(pluginName);
    this.context = context;

    this.debug = debug('checkup:task');
  }

  get config() {
    this._parseConfig();

    return this._config;
  }

  get enabled() {
    this._parseConfig();

    let enabledViaFlag = this.context.cliFlags.task?.includes(this.fullyQualifiedTaskName) || false;
    let enabled = this._enabledViaConfig || enabledViaFlag;

    this.debug('%s enabled: %s', this.fullyQualifiedTaskName, enabled);
    return enabled;
  }

  get fullyQualifiedTaskName() {
    return `${this._pluginName}/${this.taskName}`;
  }

  appendCheckupProperties(result: Result) {
    result.properties = {
      ...result.properties,
      ...{
        taskDisplayName: this.taskDisplayName,
        category: this.category,
        group: this.group,
      },
    };
    result.ruleId = this.taskName;
    return result;
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
