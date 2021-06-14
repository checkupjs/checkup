import { Log, ReportingDescriptor, Result } from 'sarif';

type RuleResults = {
  rule: ReportingDescriptor;
  results: Result[];
};

export default class CheckupLogParser {
  _resultsByRule!: Map<string, RuleResults>;

  constructor(private log: Log) {}

  get run() {
    return this.log.runs[0];
  }

  get rules() {
    return this.run.tool.driver.rules || [];
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

  get resultsByRule() {
    if (!this._resultsByRule) {
      let resultsByRule = new Map();
      let rules = this.rules;

      this.run.results?.forEach((result) => {
        if (!resultsByRule.has(result.ruleId)) {
          resultsByRule.set(result.ruleId, {
            rule: rules[result.ruleIndex!],
            results: [],
          });
        }

        resultsByRule.get(result.ruleId).results.push(result);
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
