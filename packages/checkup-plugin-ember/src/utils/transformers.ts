import { ESLintReport, buildMultiValueResult, IndexableObject, adaptResult } from '@checkup/core';

export function buildTestResult(report: ESLintReport, cwd: string) {
  let transformedResults = report.results.reduce(
    (testTypes, lintResult) => {
      let testType: string = '';
      let method: string;

      if (lintResult.messages.length === 0) {
        return testTypes;
      }

      let messages = lintResult.messages.map((lintMessage) => {
        [testType, method] = lintMessage.message.split('|');

        return adaptResult(cwd, lintResult.filePath, lintMessage, { method });
      });

      testTypes[testType].push(...messages);

      return testTypes;
    },
    {
      unit: [],
      rendering: [],
      application: [],
    } as IndexableObject
  );

  return Object.keys(transformedResults).map((key) => {
    return buildMultiValueResult(key, transformedResults[key], 'method', [
      'test',
      'skip',
      'only',
      'todo',
    ]);
  });
}
