import { LintMessage, LintResult } from '../types/analyzers';
import { NormalizedLintResult } from '../types/tasks';
import { trimCwd } from './path';

export function toLintResult(
  message: LintMessage,
  cwd: string,
  filePath: string,
  additionalData: object = {}
): NormalizedLintResult {
  return {
    filePath: trimCwd(filePath, cwd),
    lintRuleId: getLintRuleId(message),
    message: message.message,
    severity: message.severity,
    line: message.line,
    column: message.column,
    endLine: 'endLine' in message ? message.endLine! : message.line,
    endColumn: 'endColumn' in message ? message.endColumn! : message.column,
    ...additionalData,
  };
}

export function toLintResults(results: LintResult[], cwd: string): NormalizedLintResult[] {
  return results.reduce((transformed, lintingResults) => {
    const messages = (<any>lintingResults.messages)
      .filter(
        (lintMessage: LintMessage) =>
          ('ruleId' in lintMessage && lintMessage.ruleId !== undefined) ||
          ('rule' in lintMessage && lintMessage.rule !== undefined)
      )
      .filter((lintMessage: LintMessage) => {
        return (
          !lintMessage.message.includes('Parsing error') && getLintRuleId(lintMessage) === 'global'
        );
      })
      .map((lintMessage: LintMessage) => {
        return toLintResult(lintMessage, cwd, lintingResults.filePath);
      });

    transformed.push(...messages);

    return transformed;
  }, [] as NormalizedLintResult[]);
}

export const lintBuilder = {
  toLintResult,
  toLintResults,
};

function getLintRuleId(message: any) {
  if (typeof message.ruleId !== 'undefined') {
    return message.ruleId;
  } else if (typeof message.rule !== 'undefined') {
    return message.rule;
  }
  return '';
}
