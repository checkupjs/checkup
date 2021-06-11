import { Log, ReportingDescriptor, Result } from 'sarif';

type RuleResults = {
  rule: ReportingDescriptor;
  results: Result[];
};

export default class CheckupLogParser {
  _resultsByRule!: Map<string, RuleResults>;

  constructor(private log: Log) {}

  get resultsByRule() {
    if (!this._resultsByRule) {
      let resultsByRule = new Map();
      let run = this.log.runs[0];
      let rules = run.tool.driver.rules!;

      run.results?.forEach((result) => {
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

  get rulesByParentRuleID() {
    let rulesByParent = new Map();

    for (let [ruleID, ruleResult] of this.resultsByRule) {
      if (ruleResult.rule.properties?.parentRuleID) {
        rulesByParent.set(ruleID, ruleResult);
      }
    }

    return rulesByParent;
  }
}
