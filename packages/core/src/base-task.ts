import * as debug from 'debug';

import {
  TaskName,
  TaskContext,
  TaskResultLevel,
  TaskResultKind,
  TaskResultLocation,
  TaskResultProperties,
} from './types/tasks';

import { TaskConfig, ConfigValue } from './types/config';
import { getShorthandName } from './utils/plugin-name';
import { parseConfigTuple } from './config';
import { RequiredResult } from './types/checkup-log';
export default abstract class BaseTask {
  abstract taskName: TaskName;
  abstract taskDisplayName: string;
  abstract description: string;
  abstract category: string;
  group?: string;
  context: TaskContext;
  debug: debug.Debugger;

  _pluginName: string;
  _config!: TaskConfig;
  _enabled!: boolean;
  _enabledViaConfig!: boolean;

  constructor(pluginName: string, context: TaskContext) {
    this._pluginName = getShorthandName(pluginName);
    this.context = context;

    this.debug = debug('checkup:task');
  }

  /**
   * An object containing optional configuration for this Task. Tasks can be
   * configured in the .checkuprc file.
   */
  get config() {
    this._parseConfig();

    return this._config;
  }

  /**
   * A boolean indicating whether this task is enabled or not. Tasks can be
   * enabled by specifically configuring them in the .checkuprc file.
   */
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

  /**
   * The fully qualified name for this task, in the format
   *
   * <pluginName>/<taskName>
   */
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

  /**
   * Adds a result object to the Checkup output. Result objects are {@link https://docs.oasis-open.org/sarif/sarif/v2.1.0/csprd01/sarif-v2.1.0-csprd01.html#_Toc10541076|SARIF Result} format.
   *
   * @param messageText A non-empty string containing a plain text message
   * @param kind One of a fixed set of strings that specify the nature of the result
   * @param level One of a fixed set of strings that specify the severity level of the result
   * @param location Specifies a location where the result occurred
   * @param properties A property bag named properties, which stores additional values on the result
   */
  addResult(
    messageText: string,
    kind: TaskResultKind,
    level: TaskResultLevel,
    location?: TaskResultLocation,
    properties?: TaskResultProperties
  ) {
    let result: RequiredResult = {
      message: {
        text: messageText,
      },
      ruleId: this.taskName,
      kind,
      level,
      properties: {
        taskDisplayName: this.taskDisplayName,
        category: this.category,
        ...properties,
      },
    };

    if (location) {
      result.locations = [
        {
          physicalLocation: {
            artifactLocation: {
              uri: location.uri,
            },
            region: {
              startLine: location.startLine,
              startColumn: location.startColumn,
            },
          },
        },
      ];
    }

    this.context.logBuilder.addResult(result);
  }
}
