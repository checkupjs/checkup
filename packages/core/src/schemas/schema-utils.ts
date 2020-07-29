import { ESLintMessage } from '../types/parsers';

export function adaptResult(
  cwd: string,
  filePath: string,
  message: ESLintMessage,
  additionalData: object = {}
) {
  return {
    filePath: filePath.replace(cwd, ''),
    ruleId: message.ruleId,
    message: message.message,
    line: message.line,
    column: message.column,
    ...additionalData,
  };
}
