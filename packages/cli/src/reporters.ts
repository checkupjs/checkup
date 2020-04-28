import {
  Category,
  Priority,
  ReportComponentType,
  ReporterType,
  TaskResult,
  UIReportData,
  UIResultData,
  ui,
} from '@checkup/core';

import { MetaTaskResult } from './types';
import { RunFlags } from './commands/run';
import { generateHTMLReport } from './helpers/ui-report';

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
    .flatMap((result) => result.html())
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
    meta: Object.assign({}, ...metaTaskResults.map((result) => result.json())),
    results: mergedResults,
    requiresChart,
  };
}

export function _transformJsonResults(
  metaTaskResults: MetaTaskResult[],
  pluginTaskResults: TaskResult[]
) {
  let transformedResult = {
    meta: Object.assign({}, ...metaTaskResults.map((result) => result.json())),
    results: pluginTaskResults.map((result) => result.json()),
  };

  return transformedResult;
}

export function getReporter(
  flags: RunFlags,
  metaTaskResults: MetaTaskResult[],
  pluginTaskResults: TaskResult[]
) {
  switch (flags.reporter) {
    case ReporterType.stdout:
      return async () => {
        if (!flags.silent) {
          metaTaskResults.forEach((taskResult) => taskResult.toConsole());
          pluginTaskResults.forEach((taskResult) => taskResult.toConsole());
        }
      };
    case ReporterType.json:
      return async () => {
        let resultJson = _transformJsonResults(metaTaskResults, pluginTaskResults);
        ui.styledJSON(resultJson);
      };
    case ReporterType.html:
      return async () => {
        let resultsForPdf = _transformHTMLResults(metaTaskResults, pluginTaskResults);
        let reportPath = await generateHTMLReport(flags.reportOutputPath, resultsForPdf);

        ui.log(reportPath);
      };
    default:
      return async () => {};
  }
}
