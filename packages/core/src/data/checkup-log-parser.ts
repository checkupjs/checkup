import objectPath from 'object-path';
import { Log, Result } from 'sarif';
import { RuleResults } from '../types/checkup-log.js';
import { TaskName } from '../types/tasks.js';

/**
 * A class that parses a SARIF checkup log to provide a
 * simpler interface to accessing common properties.
 *
 * @example
 *
 * let logParser = new CheckupLogParser(log);
 *
 * for (let rule of logParser.rules) {
 *   console.log(rule);
 * }
 *
 * @export
 * @class CheckupLogParser
 */
export default class CheckupLogParser {
  private _resultsByRule!: Map<TaskName, RuleResults>;
  private _resultsByFile!: Map<string, Result[]>;

  constructor(private _log: Log) {}

  get log() {
    return this._log;
  }

  get run() {
    return this.log.runs[0];
  }

  get rules() {
    return this.run.tool.driver.rules || [];
  }

  get results() {
    return this.run.results || [];
  }

  get hasResults() {
    return this.results.length > 0;
  }

  get invocation() {
    return this.run.invocations![0];
  }

  get metaData() {
    let run = this.run;

    return run.tool.driver.properties?.checkup;
  }

  get timings() {
    return this.metaData.timings;
  }

  get executedTasks() {
    return this.run.tool.driver.notifications ?? [];
  }

  get actions() {
    return (
      this.invocation.toolExecutionNotifications?.filter(
        (notification) => notification.level === 'warning'
      ) || []
    );
  }

  get exceptions() {
    return (
      this.invocation.toolExecutionNotifications?.filter(
        (notification) => notification.level === 'error'
      ) || []
    );
  }

  get tasksWithExceptions() {
    return this.exceptions.reduce((taskNames, exception) => {
      let taskName = exception.associatedRule?.id;

      if (taskName) {
        taskNames.add(taskName);
      }

      return taskNames;
    }, new Set<TaskName>());
  }

  get resultsByRule(): Map<TaskName, RuleResults> {
    if (!this._resultsByRule) {
      this._resultsByRule = new Map();
      let rules = this.rules;

      this.run.results?.forEach((result) => {
        let ruleId = result.ruleId!;

        if (!this._resultsByRule.has(ruleId)) {
          this._resultsByRule.set(ruleId, {
            rule: rules[result.ruleIndex!],
            results: [],
          });
        }

        this._resultsByRule.get(ruleId)!.results.push(result);
      });
    }

    return this._resultsByRule;
  }

  get resultsByFile(): Map<string, Result[]> {
    if (!this._resultsByFile) {
      this._resultsByFile = new Map<string, Result[]>();

      this.run.results?.forEach((result) => {
        let uri = this.getPropertyValue(
          result,
          'locations.0.physicalLocation.artifactLocation.uri'
        );

        if (!this._resultsByFile.has(uri)) {
          this._resultsByFile.set(uri, []);
        }

        this._resultsByFile.get(uri)?.push(result);
      });
    }

    return this._resultsByFile;
  }

  getPropertyValue(object: object, path: string) {
    return objectPath.get(object, path);
  }
}
