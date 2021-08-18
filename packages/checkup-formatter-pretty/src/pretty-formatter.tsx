import React, { FC } from 'react';
import { Box, Text, Newline, render } from 'ink';
import { Result, Log } from 'sarif';
import { CheckupLogParser, CheckupMetadata, Formatter, FormatterOptions } from '@checkup/core';
// eslint-disable-next-line node/no-unpublished-import
import { writeResultFile } from '../../cli/src/formatters/file-writer';
import { List } from './components/list';
import { BarData } from './types';
import { Bar } from './components/bar';
import { getComponents } from './components/index';

class PrettyFormatter implements Formatter {
  options: FormatterOptions;

  constructor(options: FormatterOptions) {
    this.options = options;
  }

  MetaData: FC<{ metaData: CheckupMetadata }> = ({ metaData }) => {
    let { analyzedFilesCount, project } = metaData;
    let { name, version, repository } = project;
    let analyzedFilesMessage =
      repository.totalFiles !== analyzedFilesCount ? ` (${analyzedFilesCount} files analyzed)` : '';

    return (
      <>
        <Box flexDirection="column">
          <Text>
            Checkup report generated for {name} v{version} {analyzedFilesMessage}
          </Text>
          <Text>
            This project is {repository.age} old, with {repository.activeDays} active days,{' '}
            {repository.totalCommits} commits and {repository.totalFiles} files
          </Text>
          <Newline />
          <Text>lines of code {repository.linesOfCode.total}</Text>
          <List>
            {repository.linesOfCode.types.map((type) => {
              let barData: BarData = {
                name: type.extension,
                value: type.total,
                total: repository.linesOfCode.total,
              };
              return <Bar key={type.extension} data={barData} />;
            })}
          </List>
        </Box>
      </>
    );
  };

  TaskResults: FC<{ taskResults: Result[] }> = ({ taskResults }) => {
    let groupedTaskResults = taskResults.reduce((groupedResults: any, item: Result) => {
      if (!groupedResults[item['ruleId']!]) {
        groupedResults[item['ruleId']!] = 0;
      }
      groupedResults[item['ruleId']!] += item.occurrenceCount ? item.occurrenceCount : 1;
      return groupedResults;
    }, {});

    let tableData = [];

    for (let ruleId in groupedTaskResults) {
      tableData.push({
        ruleId: ruleId,
        'result(value)': groupedTaskResults[ruleId],
      });
    }

    let componentsMap = getComponents();
    let Component = componentsMap['inkTable'];

    return (
      <>
        <Component data={tableData} />
      </>
    );
  };

  format(logParser: CheckupLogParser) {
    let MetaData = this.MetaData;
    let TaskResults = this.TaskResults;
    let taskResults = logParser.run.results!;
    let { metaData, log } = logParser;

    render(
      <>
        <MetaData metaData={metaData} />
        <Newline />
        <TaskResults taskResults={taskResults} />
      </>
    );

    if (this.options.outputFile) {
      this.writeResultsToFile(log);
    }
  }

  writeResultsToFile(log: Log) {
    writeResultFile(log, this.options.cwd, this.options.outputFile);
  }

  // for pretty-test only
  test(logParser: CheckupLogParser) {
    let MetaData = this.MetaData;
    let TaskResults = this.TaskResults;
    let taskResults = logParser.run.results!;
    let { metaData } = logParser;

    return (
      <>
        <MetaData metaData={metaData} />
        <Newline />
        <TaskResults taskResults={taskResults} />
      </>
    );
  }
}

export default PrettyFormatter;
