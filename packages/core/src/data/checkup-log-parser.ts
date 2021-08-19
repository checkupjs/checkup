import { Log } from 'sarif';
import { RuleResults } from '../types/checkup-log';
import { TaskName } from '../types/tasks';

export default class CheckupLogParser {
  _resultsByRule!: Map<TaskName, RuleResults>;

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

  get resultsByRule(): Map<string, RuleResults> {
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

  get rulesByParentRule() {
    let rulesByParent = new Map<string, RuleResults[]>();

    for (let ruleResult of this.resultsByRule.values()) {
      let parentRuleID = ruleResult.rule.properties?.parentRuleID;
      if (parentRuleID) {
        if (!rulesByParent.has(parentRuleID)) {
          rulesByParent.set(parentRuleID, []);
        }

        rulesByParent.get(parentRuleID)?.push(ruleResult);
      }
    }

    return rulesByParent;
  }
}
