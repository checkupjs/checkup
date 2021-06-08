import { NormalizedLintResult } from '../types/tasks';

function byRuleId(lintResults: NormalizedLintResult[], ruleId: string) {
  return lintResults.filter((lintResult) => lintResult.lintRuleId === ruleId);
}

function byRuleIds(lintResults: NormalizedLintResult[], ruleIds: string[]) {
  return lintResults.filter((lintResult) => ruleIds.includes(lintResult.lintRuleId!));
}

function bySeverity(lintResultData: NormalizedLintResult[], severity: 1 | 2) {
  return lintResultData.filter((lintResult) => lintResult.severity === severity);
}

export { byRuleId, byRuleIds, bySeverity };
