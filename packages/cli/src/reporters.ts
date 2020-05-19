import {
  Category,
  OutputFormat,
  Priority,
  ReportComponentType,
  RunFlags,
  TaskResult,
  UIReportData,
  UIResultData,
  ui,
} from '@checkup/core';
import { MetaTaskResult, OutputPosition } from './types';
import { dirname, isAbsolute, resolve } from 'path';
import { existsSync, mkdirpSync, writeJsonSync } from 'fs-extra';

import { generateHTMLReport } from './helpers/ui-report';

const date = require('date-and-time');

export const TODAY = date.format(new Date(), 'YYYY-MM-DD-HH_mm_ss');
export const DEFAULT_OUTPUT_FILENAME = `checkup-report-${TODAY}`;

export function _transformHTMLResults(
  metaTaskResults: MetaTaskResult[],
  pluginTaskResults: TaskResult[]
): UIReportData {
  let mergedResults: UIResultData = {
    [Category.Insights]: {
      [Priority.High]: [],
      [Priority.Medium]: [],
      [Priority.Low]: [],
    },
    [Category.Migrations]: {
      [Priority.High]: [],
      [Priority.Medium]: [],
      [Priority.Low]: [],
    },
    [Category.Recommendations]: {
      [Priority.High]: [],
      [Priority.Medium]: [],
      [Priority.Low]: [],
    },
  };
  let requiresChart = false;

  pluginTaskResults
    .flatMap((result) => result.toReportData())
    .forEach((taskResult) => {
      if (taskResult) {
        let { category, priority } = taskResult.meta.taskClassification;

        mergedResults[category][priority].push(taskResult);

        if (taskResult.componentType === ReportComponentType.PieChart) {
          requiresChart = true;
        }
      }
    });

  return {
    meta: Object.assign({}, ...metaTaskResults.map((result) => result.toJson())),
    results: mergedResults,
    requiresChart,
  };
}

export function _transformJsonResults(
  metaTaskResults: MetaTaskResult[],
  pluginTaskResults: TaskResult[]
) {
  let transformedResult = {
    meta: Object.assign({}, ...metaTaskResults.map((result) => result.toJson())),
    results: pluginTaskResults.map((result) => result.toJson()),
  };

  return transformedResult;
}

export function getOutputPath(format: OutputFormat, outputFile: string, cwd: string = '') {
  if (format === OutputFormat.stdout) {
    throw new Error('The `stdout` format cannot be used to generate an output file path');
  }

  if (/{default}/.test(outputFile)) {
    outputFile = outputFile.replace('{default}', DEFAULT_OUTPUT_FILENAME);
  }

  let outputPath = isAbsolute(outputFile)
    ? outputFile
    : resolve(cwd, outputFile || `${DEFAULT_OUTPUT_FILENAME}.${format}`);

  let dir = dirname(outputPath);

  if (!existsSync(dir)) {
    mkdirpSync(dir);
  }

  return outputPath;
}

export function getReporter(
  flags: RunFlags,
  metaTaskResults: MetaTaskResult[],
  pluginTaskResults: TaskResult[]
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
      };
    case OutputFormat.json:
      return async () => {
        let resultJson = _transformJsonResults(metaTaskResults, pluginTaskResults);

        if (flags.outputFile) {
          let outputPath = getOutputPath(OutputFormat.json, flags.outputFile, flags.cwd);
          writeJsonSync(outputPath, resultJson);
        } else {
          ui.styledJSON(resultJson);
        }
      };
    case OutputFormat.html:
      return async () => {
        let resultsForHtml = _transformHTMLResults(metaTaskResults, pluginTaskResults);
        let reportPath = await generateHTMLReport(
          getOutputPath(OutputFormat.html, flags.outputFile, flags.cwd),
          resultsForHtml
        );

        ui.log(reportPath);
      };
    default:
      return async () => {};
  }
}
