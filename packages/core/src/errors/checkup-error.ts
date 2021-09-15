import { join } from 'path';
import * as Wrap from 'wrap-ansi';
import * as ci from 'ci-info';
import { red } from 'chalk';
import { ensureDirSync, writeFileSync, readJsonSync } from 'fs-extra';
import { todayFormat } from '../today-format';
import { ErrorDetails, ErrorDetailOptions, ErrorKind, ERROR_BY_KIND } from './error-kind';

const stripAnsi = require('strip-ansi');
const clean = require('clean-stack');

/**
 * Class that provides checkup error information
 */
export default class CheckupError extends Error {
  private details: ErrorDetails;
  private options: ErrorDetailOptions;

  /**
   * @param  {ErrorKind} kind
   * @param  {ErrorDetailOptions={}} options
   */
  constructor(kind: ErrorKind, options: ErrorDetailOptions = {}) {
    let details = ERROR_BY_KIND[kind];
    if (!details) {
      throw new Error(`ErrorKind provided missing from ERROR_BY_KIND map: ${ErrorKind}`);
    }

    super(details.message(options));

    this.name = 'CheckupError';
    this.details = details;
    this.options = options;

    // prevent this class from appearing in the stack
    Error.captureStackTrace(this, CheckupError);
  }

  render(): string {
    const wrap: typeof Wrap = require('wrap-ansi');

    process.exitCode = this.details.errorCode;

    let details: string[] = [];

    details.push(
      `${red('Checkup Error')}: ${this.message}`,
      `${this.details.callToAction(this.options)}`
    );

    if (ci.isCI) {
      return details.join('\n');
    } else {
      let logFilePath = this.writeErrorLog(details);

      details.push(`Error details written to ${logFilePath}`);
      return wrap(details.join('\n'), 80, { trim: false, hard: true });
    }
  }

  /**
   * Write error into log file
   * @param  {string[]} details
   */
  writeErrorLog(details: string[]) {
    let logFileName = `checkup-error-${todayFormat()}.log`;
    let logPath = join(process.cwd(), '.checkup');
    let logFilePath = join(logPath, logFileName);
    let logOutput: string[] = [];
    let version = readJsonSync(join(__dirname, '../../package.json')).version;

    logOutput.push(
      `Checkup v${version}`,
      '',
      stripAnsi(details.join('\n')),
      '',
      clean(this.stack || 'No stack available')
    );

    ensureDirSync(logPath);

    writeFileSync(logFilePath, logOutput.join('\n'), { encoding: 'utf-8' });

    return logFilePath;
  }
}
