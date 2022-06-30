import { isAbsolute } from 'path';
import { CheckupLogParser, FormatterOptions } from '@checkup/core';
import { createTmpDir } from '@checkup/test-helpers';
import stripAnsi from 'strip-ansi';
import SonarQubeFormatter from '../../src/formatters/sonarqube.js';
import { getFixture } from '../__utils__/get-fixture.js';

describe('SonarQube formatter', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTmpDir();
  });

  it('can generate string from format', async () => {
    const log = getFixture('checkup-result.sarif');
    const logParser = new CheckupLogParser(log);
    const options: FormatterOptions = {
      cwd: tmpDir,
      format: 'json',
    };

    let formatter = new SonarQubeFormatter(options);
    const result = stripAnsi(formatter.format(logParser));
    const formatted = JSON.parse(result);
    const firstIssue = formatted.issues[0];

    expect(formatted.issues).toHaveLength(5016);
    expect(firstIssue.engineId).toEqual('checkup');
    expect(isAbsolute(firstIssue.primaryLocation.filePath)).toEqual(true);
    expect(firstIssue.severity).toEqual('INFO');
    expect(firstIssue.type).toEqual('CODE_SMELL');
  });
});
