import { ESLintMessage, ESLintResult } from '../types/parsers';
import { LintResult } from '../types/tasks';
import { TemplateLintMessage, TemplateLintResult } from '../types/ember-template-lint';
import { normalizePath } from './path';

export function toLintResult(
  message: ESLintMessage | TemplateLintMessage,
  cwd: string,
  filePath: string,
  additionalData: object = {}
): LintResult {
  return {
    filePath: normalizePath(filePath, cwd),
    lintRuleId: getLintRuleId(message),
    message: message.message,
    severity: message.severity,
    line: message.line,
    column: message.column,
    ...additionalData,
  };
}

export function toLintResults(
  results: (ESLintResult | TemplateLintResult)[],
  cwd: string
): LintResult[] {
  return results.reduce((transformed, lintingResults) => {
    const messages = (<any>lintingResults.messages).map(
      (lintMessage: ESLintMessage | TemplateLintMessage) => {
        return toLintResult(lintMessage, cwd, lintingResults.filePath);
      }
    );
    transformed.push(...messages);

    return transformed;
  }, [] as LintResult[]);
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
