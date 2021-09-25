import * as debug from 'debug';

import { Location, PropertyBag, Result } from 'sarif';
import { SetRequired } from 'type-fest';

import {
  TaskName,
  TaskContext,
  TaskResultLevel,
  TaskResultKind,
  TaskResultOptions,
  TaskRule,
  NormalizedLintResult,
} from './types/tasks';

import { TaskConfig, ConfigValue } from './types/config';
import { getShorthandName } from './utils/plugin-name';
import { parseConfigTuple } from './config';
import { RequiredResult } from './types/checkup-log';
import CheckupLogBuilder from './data/checkup-log-builder';
import { toLintResults } from './data/lint';
import { LintResult } from './types/analyzers';

const merge = require('lodash.merge');

export default abstract class BaseTask {
  abstract taskName: TaskName;
  abstract taskDisplayName: string;
  abstract description: string;
  abstract category: string;
  group?: string;
  context: TaskContext;
  debug: debug.Debugger;
  results: Result[];

  _pluginName: string;
  _config!: TaskConfig;
  _enabled!: boolean;
  _enabledViaConfig!: boolean;
  _logBuilder: CheckupLogBuilder;

  constructor(pluginName: string, context: TaskContext) {
    this.context = context;
    this.results = [];
    this._pluginName = getShorthandName(pluginName);
    this._logBuilder = context.logBuilder;

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
    options?: TaskResultOptions
  ): RequiredResult {
    let result: RequiredResult = {
      message: {
        text: messageText,
      },
      ruleId: this.taskName,
      kind,
      level,
    };

    if (!this._logBuilder.hasRule(this.taskName)) {
      throw new Error(
        'You must call `addRule` in your Task implemenation prior to calling `addResult`'
      );
    }

    if (options?.properties) {
      result.properties = options.properties;
    }

    if (options?.location) {
      let locationOptions = options?.location;
      let location: SetRequired<Location, 'physicalLocation'> = {
        physicalLocation: {
          artifactLocation: {
            uri: locationOptions.uri,
          },
        },
      };

      if (
        Object.keys(locationOptions).some((prop) =>
          ['startLine', 'startColumn', 'endLine', 'endColumn'].includes(prop)
        )
      ) {
        location.physicalLocation.region = {
          startLine: locationOptions.startLine ?? 0,
          startColumn: locationOptions.startColumn ?? 0,
          endLine: locationOptions.endLine ?? locationOptions.startLine ?? 0,
          endColumn: locationOptions.endColumn ?? locationOptions.startColumn ?? 0,
        };
      }

      result.locations = [location];
    }

    this._logBuilder.addResult(result);
    this.results.push(result);

    return result;
  }

  /**
   * Takes an array of nested lint results, ones that contain a top-level object and a messages array representing
   * each result found for a file, and flattens them into an array of non-nested objects. This allows for easier
   * processing into SARIF result objects.
   *
   * @param results An array of lint results
   * @returns An array of normalized lint results
   */
  flattenLintResults(results: LintResult[]): NormalizedLintResult[] {
    return toLintResults(results, this.context.options.cwd);
  }

  public addRule(additionalRuleProps?: TaskRule) {
    let taskRule;
    let ruleProps = {
      id: this.taskName,
      shortDescription: {
        text: this.description,
      },
      properties: {
        taskDisplayName: this.taskDisplayName,
        category: this.category,
      },
    };

    taskRule = merge({}, ruleProps, additionalRuleProps);

    this._logBuilder.addRule(taskRule);

    return taskRule.id;
  }

  public addRuleProperties(properties: PropertyBag) {
    let rule = this._logBuilder.getRule(this.taskName);

    if (!rule) {
      throw new Error(
        'You must call `addRule` in your Task implemenation prior to calling `addResult`'
      );
    }

    merge(rule.properties, properties);
  }
}
