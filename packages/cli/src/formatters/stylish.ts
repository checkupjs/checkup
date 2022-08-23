import chalk from 'chalk';
import { CheckupLogParser, Formatter, FormatterOptions, Task } from '@checkup/core';
import stripAnsi from 'strip-ansi';
import table from 'text-table';
import { Result } from 'sarif';

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
      let total = logParser.results.length;
      let summary = new Map<string, number>([
        ['migrations', 0],
        ['info', 0],
        ['best practices', 0],
        ['linting', 0],
        ['testing', 0],
        ['metrics', 0],
        ['results', 0],
      ]);

      for (const [uri, resultsForUri] of results) {
        output += `${chalk.underline(uri)}\n`;

        output += `${table(
          resultsForUri.map((result) => {
            let category = getCategory(logParser, result);
            let messageType = getMessageType(category);
            let count = summary.get(category) || 0;
            summary.set(category, (count += 1));

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
          .map((el) => el.replace(/(\d+)\s+(\d+)/u, (m, p1, p2) => chalk.dim(`${p1}:${p2}`)))
          .join('\n')}\n\n`;
      }

      // loop summaries and add to list, enclose in parens
      output += chalk.white.bold(
        [
          '✅ ',
          total,
          ' results',
          ' (',
          [...summary.entries()]
            .filter(([, count]) => count > 0)
            .map(([category, count]) => `${getMessageType(category)} ${count}`)
            .join(', '),
          ')\n',
        ].join('')
      );
    }

    return output;
  }
}

function getCategory(lp: CheckupLogParser, result: Result): Task['category'] {
  let ruleId = result.ruleId;

  if (!ruleId) {
    return '';
  }

  let rule = lp.getRule(ruleId);

  if (!rule) {
    return '';
  }

  return lp.getPropertyValue(rule, 'properties.category') || 'results';
}

function getMessageType(category: Task['category']) {
  let messageTypes = new Map<string, string>([
    ['migrations', chalk.magenta('migrations')],
    ['info', chalk.blueBright('info')],
    ['best practices', chalk.green('best practices')],
    ['linting', chalk.cyan('linting')],
    ['testing', chalk.greenBright('testing')],
    ['metrics', chalk.yellow('metrics')],
  ]);

  return messageTypes.has(category) ? messageTypes.get(category) : chalk.white(category);
}
