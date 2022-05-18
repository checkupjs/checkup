import debug from 'debug';

import { Location, PropertyBag, ReportingDescriptor, Result } from 'sarif';
import { SetRequired } from 'type-fest';

import merge from 'lodash.merge';
import {
  TaskName,
  TaskContext,
  TaskResultLevel,
  TaskResultKind,
  TaskResultOptions,
  TaskRule,
  NormalizedLintResult,
} from './types/tasks';

import { TaskConfig, ConfigValue } from './types/config.js';
import { getShorthandName } from './utils/normalize-package-name.js';
import { parseConfigTuple } from './config.js';
import { RequiredResult } from './types/checkup-log.js';
import CheckupLogBuilder from './data/checkup-log-builder.js';
import { toLintResults } from './data/lint.js';
import { LintResult } from './types/analyzers.js';

export default abstract class BaseTask {
  abstract taskName: TaskName;
  abstract taskDisplayName: string;
  abstract description: string;
  abstract category: string;
  rule?: ReportingDescriptor;
  group?: string;
  context: TaskContext;
  debug: debug.Debugger;
  results: Result[];
  nonFatalErrors: Error[];

  _pluginName: string;
  _config!: TaskConfig;
  _enabled!: boolean;
  _enabledViaConfig!: boolean;
  _logBuilder: CheckupLogBuilder;

  /**
   * Creates a new instance of a BaseTask.
   *
   * @param pluginName The name of the plugin this task is included in.
   * @param context The runtime task context passed to the Task.
   */
  constructor(pluginName: string, context: TaskContext) {
    this.context = context;
    this.results = [];
    this.nonFatalErrors = [];
    this._pluginName = getShorthandName(pluginName);
    this._logBuilder = context.logBuilder;

    this.debug = debug('checkup:task');
  }

  /**
   * Gets a reference to the SARIF log.
   *
   * @readonly
   * @memberof BaseTask
   */
  get log() {
    return this._logBuilder.log;
  }

  /**
   * Gets an object containing optional configuration for this Task. Tasks can be
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
   * pluginName/taskName
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
   * @param options Additional options to pass to the result
   * @param options.location Specifies a location where the result occurred
   * @param options.properties A property bag named properties, which stores additional values on the result
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

  /**
   * Adds rule metadata to the SARIF log.
   *
   * @param additionalRuleProps - Additional properties to be passed to the SARIF rule metadata.
   * @returns The task name, which represents the rule ID in the SARIF log.
   */
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

    this.rule = taskRule = merge({}, ruleProps, additionalRuleProps);

    this._logBuilder.addRule(taskRule);

    return taskRule.id;
  }

  /**
   * Adds additional properties to the rule metadata's properties in the SARIF log.
   *
   * @param properties - A {PropertyBag} to be merged with the rule metadata's properties.
   */
  public addRuleProperties(properties: PropertyBag) {
    let rule = this._logBuilder.getRule(this.taskName);

    if (!rule) {
      throw new Error(
        'You must call `addRule` in your Task implemenation prior to calling `addRuleProperties`'
      );
    }

    merge(rule.properties, properties);
  }

  /**
   * Adds non-fatal error encountered while running a task to the SARIF log.
   *
   * @param error - A non-fatal {Error} thrown while the task was run
   */
  public addNonFatalError(error: Error) {
    this.nonFatalErrors.push(error);
  }
}
