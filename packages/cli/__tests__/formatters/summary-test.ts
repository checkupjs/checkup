import { CheckupLogParser, FormatterOptions } from '@checkup/core';
import { createTmpDir } from '@checkup/test-helpers';
import stripAnsi from 'strip-ansi';
import SummaryFormatter from '../../src/formatters/summary.js';
import { getFixture } from '../__utils__/get-fixture.js';

describe('Summary formatter', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTmpDir();
    process.env.TESTING_TMP_DIR = tmpDir;
  });

  afterEach(() => {
    process.env.TESTING_TMP_DIR = undefined;
  });

  it('can generate string from format', async () => {
    const log = getFixture('checkup-result.sarif');
    const logParser = new CheckupLogParser(log);
    const options: FormatterOptions = {
      cwd: '',
      format: 'summary',
    };

    let formatter = new SummaryFormatter(options);

    const result = stripAnsi(formatter.format(logParser));

    expect(result).toContain('Checkup report generated for travis v0.0.1 (1765 files analyzed)');
    expect(result).toContain(
      'This project is 9 years old, with 1470 active days, 6012 commits and 1692 files'
    );
    expect(result).toContain('Checkup ran the following task(s):');
    expect(result).toContain('Results have been saved to the following file:');
    expect(result).toContain('checkup v1.0.0-beta.14');
    expect(result).toContain('config 257cda6f6d50eeef891fc6ec8d808bdb');
  });

  it('should render timing if CHECKUP_TIMING=1', async () => {
    process.env.CHECKUP_TIMING = '1';

    const log = getFixture('checkup-result.sarif');
    const logParser = new CheckupLogParser(log);
    const options: FormatterOptions = {
      cwd: '',
      format: 'summary',
    };

    let formatter = new SummaryFormatter(options);

    const result = formatter.format(logParser);

    delete process.env.CHECKUP_TIMING;

    expect(stripAnsi(result)).toContain('Task Timings');
  });
});
