import { MetaTaskResult, OutputPosition } from './types';
import { OutputFormat, RunFlags, TaskError, TaskResult, ui, Action2 } from '@checkup/core';
import { dirname, isAbsolute, resolve } from 'path';
import { existsSync, mkdirpSync, writeJsonSync } from 'fs-extra';

import { startCase } from 'lodash';

const date = require('date-and-time');

export const TODAY = date.format(new Date(), 'YYYY-MM-DD-HH_mm_ss');
export const DEFAULT_OUTPUT_FILENAME = `checkup-report-${TODAY}`;

export function _transformJsonResults(
  metaTaskResults: MetaTaskResult[],
  pluginTaskResults: TaskResult[],
  errors: TaskError[],
  actions: Action2[]
) {
  let transformedResult = {
    meta: Object.assign({}, ...metaTaskResults.map((result) => result.toJson())),
    results: pluginTaskResults.map((result) => result.toJson()),
    errors,
    actions,
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
  let actions = pluginTaskResults
    .filter((taskResult) => taskResult.actions)
    .flatMap((taskResult) => taskResult.actions) as Action2[];

  switch (flags.format) {
    case OutputFormat.stdout:
      return async () => {
        renderMetaTaskResults(metaTaskResults, OutputPosition.Header);
        renderPluginTaskResults(pluginTaskResults);
        renderActionItems(actions);
        renderMetaTaskResults(metaTaskResults, OutputPosition.Footer);
        renderErrors(errors);
      };
    case OutputFormat.json:
      return async () => {
        let resultJson = _transformJsonResults(metaTaskResults, pluginTaskResults, errors, actions);

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

function renderActionItems(actions: Action2[]): void {
  if (actions.length > 0) {
    let tabularActions = actions.map((action) => {
      return {
        summary: action.summary,
        details: action.details,
      };
    });

    ui.categoryHeader('Actions');
    ui.table(tabularActions, { summary: { header: 'Summary' }, details: { header: 'Details' } });
    ui.blankLine();
  }
}

function renderPluginTaskResults(pluginTaskResults: TaskResult[]): void {
  let currentCategory = '';

  pluginTaskResults.forEach((taskResult) => {
    let taskCategory = taskResult.meta.taskClassification.category;

    if (taskCategory !== currentCategory) {
      ui.categoryHeader(startCase(taskCategory));
      currentCategory = taskCategory;
    }

    taskResult.toConsole();
  });
  ui.blankLine();
}

function renderMetaTaskResults(metaTaskResults: MetaTaskResult[], outputPosition: OutputPosition) {
  metaTaskResults
    .filter((taskResult) => taskResult.outputPosition === outputPosition)
    .forEach((taskResult) => taskResult.toConsole());
}

function renderErrors(errors: TaskError[]) {
  if (errors.length > 0) {
    ui.table(errors, { taskName: {}, error: {} });
  }
}
