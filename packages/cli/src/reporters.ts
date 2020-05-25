import { MetaTaskResult, OutputPosition } from './types';
import { OutputFormat, RunFlags, TaskError, TaskResult, ui } from '@checkup/core';
import { dirname, isAbsolute, resolve } from 'path';
import { existsSync, mkdirpSync, writeJsonSync } from 'fs-extra';

const date = require('date-and-time');

export const TODAY = date.format(new Date(), 'YYYY-MM-DD-HH_mm_ss');
export const DEFAULT_OUTPUT_FILENAME = `checkup-report-${TODAY}`;

export function _transformJsonResults(
  metaTaskResults: MetaTaskResult[],
  pluginTaskResults: TaskResult[],
  errors: TaskError[]
) {
  let transformedResult = {
    meta: Object.assign({}, ...metaTaskResults.map((result) => result.toJson())),
    results: pluginTaskResults.map((result) => result.toJson()),
    errors,
  };

  return transformedResult;
}

export function getOutputPath(outputFile: string, cwd: string = '') {
  if (/{default}/.test(outputFile)) {
    outputFile = outputFile.replace('{default}', DEFAULT_OUTPUT_FILENAME);
  }

  let outputPath = isAbsolute(outputFile)
    ? outputFile
    : resolve(cwd, outputFile || `${DEFAULT_OUTPUT_FILENAME}.json`);

  let dir = dirname(outputPath);

  if (!existsSync(dir)) {
    mkdirpSync(dir);
  }

  return outputPath;
}

export function getReporter(
  flags: RunFlags,
  metaTaskResults: MetaTaskResult[],
  pluginTaskResults: TaskResult[],
  errors: TaskError[]
) {
  switch (flags.format) {
    case OutputFormat.stdout:
      return async () => {
        metaTaskResults
          .filter((taskResult) => taskResult.outputPosition === OutputPosition.Header)
          .forEach((taskResult) => taskResult.toConsole());

        pluginTaskResults.forEach((taskResult) => taskResult.toConsole());

        metaTaskResults
          .filter((taskResult) => taskResult.outputPosition === OutputPosition.Footer)
          .forEach((taskResult) => taskResult.toConsole());

        if (errors.length > 0) {
          ui.table(errors, { taskName: {}, error: {} });
        }
      };
    case OutputFormat.json:
      return async () => {
        let resultJson = _transformJsonResults(metaTaskResults, pluginTaskResults, errors);

        if (flags.outputFile) {
          let outputPath = getOutputPath(flags.outputFile, flags.cwd);

          writeJsonSync(outputPath, resultJson);

          ui.log(outputPath);
        } else {
          ui.styledJSON(resultJson);
        }
      };
    default:
      return async () => {};
  }
}
