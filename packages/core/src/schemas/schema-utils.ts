import { ESLintMessage } from '../types/parsers';

export function adaptResult(
  cwd: string,
  filePath: string,
  message: ESLintMessage,
  additionalData: object = {}
) {
  return {
    filePath: normalizePath(filePath, cwd),
    ruleId: message.ruleId,
    message: message.message,
    line: message.line,
    column: message.column,
    ...additionalData,
  };
}

export function normalizePath(path: string, cwd: string) {
  return path.replace(cwd, '');
}

export function normalizePaths(paths: string[], cwd: string) {
  return paths.map((path) => normalizePath(path, cwd));
}
