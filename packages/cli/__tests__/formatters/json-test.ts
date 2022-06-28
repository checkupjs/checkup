import '@microsoft/jest-sarif';
import { CheckupLogParser, FormatterOptions } from '@checkup/core';
import stripAnsi from 'strip-ansi';
import JsonFormatter from '../../src/formatters/json.js';
import { getFixture } from '../__utils__/get-fixture.js';

describe('Json formatter', () => {
  it('can generate string from format', async () => {
    const log = getFixture('checkup-result.sarif');
    const logParser = new CheckupLogParser(log);
    const options: FormatterOptions = {
      cwd: '',
      format: 'json',
    };

    let formatter = new JsonFormatter(options);

    const result = stripAnsi(formatter.format(logParser));
    let formattedLog = JSON.parse(result);

    expect(formattedLog).toBeValidSarifLog();
    expect(formattedLog).toStrictEqual(log);
  });
});
