import { LintResultData } from '../types/tasks';

function byRuleId(lintResultData: LintResultData[], ruleId: string) {
  return lintResultData.filter((lintResult) => lintResult.ruleId === ruleId);
}

function bySeverity(lintResultData: LintResultData[], severity: 1 | 2) {
  return lintResultData.filter((lintResult) => lintResult.severity === severity);
}

export { byRuleId, bySeverity };
