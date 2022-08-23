import chalk from 'chalk';
import { CheckupLogParser, Formatter, FormatterOptions } from '@checkup/core';
import stripAnsi from 'strip-ansi';
import table from 'text-table';

export default class StylishFormatter implements Formatter {
  shouldWrite = true;
  options: FormatterOptions;

  constructor(options: FormatterOptions) {
    this.options = options;
  }

  format(logParser: CheckupLogParser): string {
    let output = '\n';

    if (logParser.results.length > 0) {
      let results = logParser.resultsByFile;

      for (const [uri, resultsForUri] of results) {
        output += `${chalk.underline(uri)}\n`;

        output += `${table(
          resultsForUri.map((result) => {
            let messageType;
            messageType = result.level === 'error' ? chalk.red('error') : chalk.yellow('warning');
            return [
              '',
              logParser.getPropertyValue(result, 'locations.0.physicalLocation.region.startLine') ||
                0,
              logParser.getPropertyValue(
                result,
                'locations.0.physicalLocation.region.startColumn'
              ) || 0,
              messageType,
              result.message.text?.replace(/([^ ])\.$/u, '$1'),
              chalk.dim(result.ruleId || ''),
            ];
          }),
          {
            align: [null, 'r', 'l'],
            stringLength(str: string) {
              return stripAnsi(str).length;
            },
          }
        )
          .split('\n')
          // .map((el) => el.replace(/(\d+)\s+(\d+)/u, (m, p1, p2) => chalk.dim(`${p1}:${p2}`)))
          .join('\n')}\n\n`;
      }
    }

    return output;
  }
}
