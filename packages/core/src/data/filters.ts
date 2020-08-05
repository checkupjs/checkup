import { LintResult } from '../types/tasks';

function byRuleId(lintResult: LintResult[], ruleId: string) {
  return lintResult.filter((lintResult) => lintResult.ruleId === ruleId);
}

function byRuleIds(lintResult: LintResult[], ruleIds: string[]) {
  return lintResult.filter((lintResult) => ruleIds.includes(lintResult.ruleId!));
}

function bySeverity(lintResultData: LintResult[], severity: 1 | 2) {
  return lintResultData.filter((lintResult) => lintResult.severity === severity);
}

export { byRuleId, byRuleIds, bySeverity };
