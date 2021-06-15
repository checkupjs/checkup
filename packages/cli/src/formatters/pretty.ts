// import {
//   CheckupError,
//   getRegisteredTaskReporters,
//   groupDataByField,
//   reduceResults,
//   renderEmptyResult,
//   ErrorKind,
//   FormatterArgs,
// } from '@checkup/core';
// import * as cleanStack from 'clean-stack';
// import { startCase } from 'lodash';
// import { Notification, Result } from 'sarif';
// import { renderActions, renderCLIInfo, renderInfo, renderLinesOfCode } from './formatter-utils';
// import { writeResultFile } from './file-writer';

// export default class PrettyFormatter {
//   args: FormatterArgs;

//   constructor(args: FormatterArgs) {
//     this.args = args;
//   }

//   format() {
//     let run = this.args.logParser.run;
//     let metaData = this.args.logParser.metaData;

//     renderInfo(metaData, this.args);
//     renderLinesOfCode(metaData, this.args);

//     this.renderTaskResults(run.results);
//     this.renderErrors(this.args.logParser.exceptions);

//     renderActions(this.args.logParser.actions, this.args);

//     if (process.env.CHECKUP_TIMING === '1') {
//       this.renderTimings(this.args.logParser.timings);
//     }

//     renderCLIInfo(metaData, this.args);

//     if (this.args.outputFile) {
//       writeResultFile(this.args.writer.outputString, this.args.cwd, this.args.outputFile);
//     }
//   }

//   renderTaskResults(results: Result[] | undefined): void {
//     let currentCategory = '';

//     if (results) {
//       let resultsByRule = this.args.logParser.resultsByRule;

//       resultsByRule.forEach(({ rule, results }) => {
//         let category = rule.properties?.category;

//         if (category !== currentCategory) {
//           this.args.writer.categoryHeader(startCase(category));
//           currentCategory = category;
//         }

//         let reporter = this.getTaskReporter(rule.id);

//         reporter(results, this.args);
//       });
//     }
//     this.args.writer.blankLine();
//   }

//   getTaskReporter(taskName: string) {
//     let registeredTaskReporters = getRegisteredTaskReporters();
//     let reporter = registeredTaskReporters.get(taskName) || this.getReportComponent.bind(this);

//     if (typeof reporter === 'undefined') {
//       throw new CheckupError(ErrorKind.TaskConsoleReporterNotFound, { taskName });
//     }

//     return reporter;
//   }

//   getReportComponent(taskResults: Result[]) {
//     const groupedTaskResults = reduceResults(groupDataByField(taskResults, 'message.text'));

//     this.args.writer.section(groupedTaskResults[0].properties?.taskDisplayName, () => {
//       const totalResults = groupedTaskResults.length;

//       if (totalResults > 1) {
//         this.args.writer.log(`Total: ${totalResults}`);
//       }

//       groupedTaskResults.forEach((result) => {
//         if (result.message.text === 'No results found') {
//           renderEmptyResult(result);
//         } else {
//           this.args.writer.value({
//             title: result.message.text || (result.ruleId as string),
//             count: result?.occurrenceCount || Number.NaN,
//           });
//         }
//       });
//     });
//   }

//   renderErrors(notifications: Notification[] | undefined) {
//     if (notifications && notifications.length > 0) {
//       this.args.writer.table(
//         notifications.map((notification) => {
//           return [
//             notification.associatedRule?.id as string,
//             cleanStack(notification.exception?.stack?.frames.join('\n') || ''),
//           ];
//         }),
//         ['Task Name', 'Error']
//       );
//     }
//   }

//   renderTimings(timings: Record<string, number>) {
//     let total = Object.values(timings).reduce((total, timing) => (total += timing), 0);

//     this.args.writer.categoryHeader('Task Timings');

//     this.args.writer.table(
//       Object.keys(timings)
//         .map((taskName) => [
//           taskName,
//           Number.parseFloat(timings[taskName].toFixed(2)),
//           `${((timings[taskName] * 100) / total).toFixed(1)}%`,
//         ])
//         .sort((a, b) => (b[1] as number) - (a[1] as number)),
//       ['Task Name', 'Time (sec)', 'Relative']
//     );

//     this.args.writer.blankLine();
//   }
// }
