import {
  CheckupError,
  getRegisteredTaskReporters,
  groupDataByField,
  reduceResults,
  renderEmptyResult,
  ErrorKind,
  ConsoleWriter,
  BufferedWriter,
  BaseOutputWriter,
  FormatterOptions,
  CheckupLogParser,
  RuleResults,
} from '@checkup/core';
import * as cleanStack from 'clean-stack';
import { startCase } from 'lodash';
import { Notification, Result } from 'sarif';
import { renderActions, renderCLIInfo, renderInfo, renderLinesOfCode } from './formatter-utils';
import { writeResultFile } from './file-writer';

export default class PrettyFormatter {
  options: FormatterOptions;
  writer: BaseOutputWriter;

  constructor(options: FormatterOptions) {
    this.options = options;

    this.writer = this.options.outputFile ? new BufferedWriter() : new ConsoleWriter();
  }

  format(logParser: CheckupLogParser) {
    let metaData = logParser.metaData;

    renderInfo(metaData, this.writer);
    renderLinesOfCode(metaData, this.writer);

    this.renderTaskResults(logParser.resultsByRule);
    this.renderErrors(logParser.exceptions);

    renderActions(logParser.actions, this.writer);

    if (process.env.CHECKUP_TIMING === '1') {
      this.renderTimings(logParser.timings);
    }

    renderCLIInfo(metaData, this.writer);

    if (this.options.outputFile) {
      writeResultFile(
        (<BufferedWriter>this.writer).buffer,
        this.options.cwd,
        this.options.outputFile
      );
    }
  }

  renderTaskResults(resultsByRule: Map<string, RuleResults> | undefined): void {
    let currentCategory = '';

    if (resultsByRule) {
      resultsByRule.forEach(({ rule, results }) => {
        let category = rule.properties?.category;

        if (category !== currentCategory) {
          this.writer.categoryHeader(startCase(category));
          currentCategory = category;
        }

        let reporter = this.getTaskReporter(rule.id);

        reporter(results, this.writer);
      });
    }
    this.writer.blankLine();
  }

  getTaskReporter(taskName: string) {
    let registeredTaskReporters = getRegisteredTaskReporters();
    let reporter = registeredTaskReporters.get(taskName) || this.getReportComponent.bind(this);

    if (typeof reporter === 'undefined') {
      throw new CheckupError(ErrorKind.TaskConsoleReporterNotFound, { taskName });
    }

    return reporter;
  }

  getReportComponent(taskResults: Result[]) {
    const groupedTaskResults = reduceResults(groupDataByField(taskResults, 'message.text'));

    this.writer.section(groupedTaskResults[0].properties?.taskDisplayName, () => {
      const totalResults = groupedTaskResults.length;

      if (totalResults > 1) {
        this.writer.log(`Total: ${totalResults}`);
      }

      groupedTaskResults.forEach((result) => {
        if (result.message.text === 'No results found') {
          renderEmptyResult(result);
        } else {
          this.writer.value({
            title: result.message.text || (result.ruleId as string),
            count: result?.occurrenceCount || Number.NaN,
          });
        }
      });
    });
  }

  renderErrors(notifications: Notification[] | undefined) {
    if (notifications && notifications.length > 0) {
      this.writer.table(
        notifications.map((notification) => {
          return [
            notification.associatedRule?.id as string,
            cleanStack(notification.exception?.stack?.frames.join('\n') || ''),
          ];
        }),
        ['Task Name', 'Error']
      );
    }
  }

  renderTimings(timings: Record<string, number>) {
    let total = Object.values(timings).reduce((total, timing) => (total += timing), 0);

    this.writer.categoryHeader('Task Timings');

    this.writer.table(
      Object.keys(timings)
        .map((taskName) => [
          taskName,
          Number.parseFloat(timings[taskName].toFixed(2)),
          `${((timings[taskName] * 100) / total).toFixed(1)}%`,
        ])
        .sort((a, b) => (b[1] as number) - (a[1] as number)),
      ['Task Name', 'Time (sec)', 'Relative']
    );

    this.writer.blankLine();
  }
}
