import { isAbsolute, resolve } from 'path';
import { CheckupLogParser, Formatter, FormatterOptions } from '@checkup/core';
import { Result, PhysicalLocation } from 'sarif';

type PartialRecord<K extends keyof any, T> = {
  [P in K]: T;
};

type ErrorLevel = Extract<Result.level, 'error' | 'warning' | 'note'>;

// BLOCKER, CRITICAL, MAJOR, MINOR, INFO
const SONARQUBE_SEVERITY: PartialRecord<Result.kind, string> = {
  notApplicable: 'INFO',
  pass: 'INFO',
  fail: 'BLOCKER',
  review: 'CRITICAL',
  open: 'MINOR',
  informational: 'INFO',
};

// BUG, VULNERABILITY, CODE_SMELL
const SONARQUBE_TYPE: PartialRecord<ErrorLevel, string> = {
  note: 'CODE_SMELL',
  warning: 'CODE_SMELL',
  error: 'BUG',
};

export default class SonarQubeFormatter implements Formatter {
  shouldWrite = true;
  options: FormatterOptions;

  constructor(options: FormatterOptions) {
    this.options = options;
  }

  format(logParser: CheckupLogParser) {
    const issues = [];

    if (logParser.results.length > 0) {
      let results = logParser.results.filter((result) => result.level! === 'none');

      for (const result of results) {
        let physicalLocation = getPhysicalLocation(result);
        let filePath = getFilePath(physicalLocation);
        let absolutePath = isAbsolute(filePath) ? filePath : resolve(this.options.cwd, filePath);

        issues.push({
          engineId: 'checkup',
          ruleId: result.ruleId,
          severity: SONARQUBE_SEVERITY[result.kind ?? 'notApplicable'],
          type: SONARQUBE_TYPE[result.level as ErrorLevel],
          primaryLocation: {
            message: result.message.text ?? '',
            filePath: absolutePath,
            textRange: {
              startLine: physicalLocation.region?.startLine ?? 0,
              startColumn: physicalLocation.region?.startColumn ?? 0,
              endLine: physicalLocation.region?.endLine ?? 0,
              endColumn: physicalLocation.region?.endColumn ?? 0,
            },
          },
        });
      }
    }

    return JSON.stringify({ issues }, null, 2);
  }
}

function getPhysicalLocation(result: Result) {
  return (result.locations && result.locations[0].physicalLocation) ?? {};
}

function getFilePath(physicalLocation: PhysicalLocation) {
  return physicalLocation?.artifactLocation?.uri ?? '';
}
