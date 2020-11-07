import { LintResult } from '../types/tasks';

function byRuleId(lintResults: LintResult[], ruleId: string) {
  return lintResults.filter((lintResult) => lintResult.lintRuleId === ruleId);
}

function byRuleIds(lintResults: LintResult[], ruleIds: string[]) {
  return lintResults.filter((lintResult) => ruleIds.includes(lintResult.lintRuleId!));
}

function bySeverity(lintResultData: LintResult[], severity: 1 | 2) {
  return lintResultData.filter((lintResult) => lintResult.severity === severity);
}

export { byRuleId, byRuleIds, bySeverity };
