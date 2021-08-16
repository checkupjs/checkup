import React, { FC } from 'react';
import { Box, Text, Newline, render } from 'ink';
import { Result } from 'sarif';
import { CheckupLogParser, CheckupMetadata } from '@checkup/core';
import { List } from './components/list';
import { BarData } from './types';
import { Bar } from './components/bar';
import { getComponents } from './components/index';

class PrettyFormatter {
  constructor(logParser: CheckupLogParser) {
    this.metaData = logParser.metaData;
    this.taskResults = logParser.run.results!;
  }

  metaData: CheckupMetadata;
  taskResults: Result[];

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

  render() {
    let MetaData = this.MetaData;
    let TaskResults = this.TaskResults;

    render(
      <>
        <MetaData metaData={this.metaData} />
        <Newline />
        <TaskResults taskResults={this.taskResults} />
      </>
    );
  }

  // for pretty-test only
  test() {
    let MetaData = this.MetaData;
    let TaskResults = this.TaskResults;

    return (
      <>
        <MetaData metaData={this.metaData} />
        <Newline />
        <TaskResults taskResults={this.taskResults} />
      </>
    );
  }
}

export default PrettyFormatter;
