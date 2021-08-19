import * as React from 'react';
import { FC } from 'react';
import { Box, Text, Newline } from 'ink';
import { Result, ReportingDescriptor } from 'sarif';
import { CheckupLogParser, CheckupMetadata } from '@checkup/core';
// eslint-disable-next-line node/no-unpublished-import
// import { writeResultFile } from '../../cli/src/formatters/file-writer';
import { List } from './components/list';
import { BarData } from './types';
import { Bar } from './components/bar';
import { getComponents } from './components/index';

type RuleResults = {
  rule: ReportingDescriptor;
  results: Result[];
};

interface UIData {
  tableData: any[];
  category: string;
}

const PrettyFormatter: FC<{ logParser: CheckupLogParser }> = ({ logParser }) => {
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

const CLIInfo: FC<{ metaData: CheckupMetadata }> = ({ metaData }) => {
  let { version, configHash } = metaData.cli;

  return (
    <>
      <Text>checkup v{version}</Text>
      <Text>config {configHash}</Text>
    </>
  );
};

const MetaData: FC<{ metaData: CheckupMetadata }> = ({ metaData }) => {
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

const RenderTiming: FC<{ timings: Record<string, number> }> = ({ timings }) => {
  let componentsMap = getComponents();
  let Component = componentsMap['inkTable'];
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
      <Component data={tableData} />
    </>
  );
};

const TaskResults: FC<{ taskResults: Map<string, RuleResults> | undefined }> = ({
  taskResults,
}) => {
  let currentCategory = '';

  if (taskResults!.size > 0) {
    let componentsMap = getComponents();
    let Component = componentsMap['inkTable'];

    let results: UIData[] = [];
    let index = -1;

    [...taskResults!.values()].forEach((taskResult) => {
      let taskCategory = taskResult!.rule?.properties?.category;
      if (taskCategory !== currentCategory) {
        currentCategory = taskCategory;
        index += 1;
        results[index] = {
          category: currentCategory,
          tableData: [
            {
              ruleId: taskResult!.rule?.id,
              'result(value)': taskResult.results.length,
            },
          ],
        };
      } else {
        results[index].tableData.push({
          ruleId: taskResult!.rule?.id,
          'result(value)': taskResult.results.length,
        });
      }
    });

    return (
      <List>
        {results.map((result) => {
          return (
            <>
              <Text>=== {result['category']}</Text>
              <Component data={result['tableData']} />
            </>
          );
        })}
      </List>
    );
  } else {
    return <Text></Text>;
  }
};

export default PrettyFormatter;
