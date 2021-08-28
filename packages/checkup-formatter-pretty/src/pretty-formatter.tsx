import * as React from 'react';
import { Box, Text, Newline } from 'ink';
import { CheckupLogParser, CheckupMetadata, TaskName, RuleResults } from '@checkup/core';
import { default as InkTable } from 'ink-table';
import { List } from './components/list';
import { BarData } from './types';
import { Bar } from './components/bar';
import { registeredComponents } from './component-provider';

const PrettyFormatter: React.FC<{ logParser: CheckupLogParser }> = ({ logParser }) => {
  let metaData: CheckupMetadata = logParser.metaData;
  let taskResults: Map<string, RuleResults> | undefined = logParser.resultsByRule;

  return (
    <>
      <MetaData metaData={metaData} />
      <Newline />
      <TaskResults taskResults={taskResults} />
      <Newline />
      {process.env.CHECKUP_TIMING === '1' ? <RenderTiming timings={logParser.timings} /> : <></>}
      <CLIInfo metaData={metaData} />
    </>
  );
};

const CLIInfo: React.FC<{ metaData: CheckupMetadata }> = ({ metaData }) => {
  let { version, configHash } = metaData.cli;

  return (
    <>
      <Text>checkup v{version}</Text>
      <Text>config {configHash}</Text>
    </>
  );
};

const MetaData: React.FC<{ metaData: CheckupMetadata }> = ({ metaData }) => {
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
          {repository.linesOfCode.types
            .sort((a, b) => {
              if (a.total > b.total) {
                return -1;
              } else if (a.total === b.total) {
                return a.extension > b.extension ? 1 : -1;
              } else {
                return 1;
              }
            })
            .map((type) => {
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

const RenderTiming: React.FC<{ timings: Record<string, number> }> = ({ timings }) => {
  let total = Object.values(timings).reduce((total, timing) => (total += timing), 0);
  let tableData: any[] = [];

  Object.keys(timings).map((taskName) => {
    let timing = Number.parseFloat(timings[taskName].toFixed(2));
    let relavtive = `${((timings[taskName] * 100) / total).toFixed(1)}%`;
    tableData.push({
      'Task Name': taskName,
      'Time (sec)': timing,
      'Relative: ': relavtive,
    });
  });

  return (
    <>
      <Text>Task Timings</Text>
      <InkTable data={tableData} />
    </>
  );
};

const TaskResults: React.FC<{
  taskResults: Map<TaskName, RuleResults> | undefined;
}> = ({ taskResults }) => {
  let r: { Component: React.FC<any>; taskResult: RuleResults }[] = [];

  if (taskResults!.size > 0) {
    [...taskResults!.values()].forEach((taskResult) => {
      let taskProps = taskResult!.rule?.properties!;
      let componentName = taskProps.component;

      r.push({
        Component: registeredComponents.get(componentName ?? 'table')!,
        taskResult,
      });
    });

    return (
      <List>
        {r.map(({ Component, taskResult }) => {
          return (
            <Box flexDirection="column" key={taskResult.rule.id}>
              <Component taskResult={taskResult} />
            </Box>
          );
        })}
      </List>
    );
  } else {
    return <Text></Text>;
  }
};

export default PrettyFormatter;
