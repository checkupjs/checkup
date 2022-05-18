import * as React from 'react';
import { Box, Text, Newline } from 'ink';
import { CheckupLogParser, CheckupMetadata, TaskName, RuleResults } from '@checkup/core';
import { ReportingDescriptor } from 'sarif';
import { default as InkTable } from 'ink-table';
import { registeredComponents } from './component-provider.js';

const PrettyFormatter: React.FC<{ logParser: CheckupLogParser }> = ({ logParser }) => {
  let metaData: CheckupMetadata = logParser.metaData;
  let taskResults: Map<string, RuleResults> | undefined = logParser.resultsByRule;
  let rules = logParser.rules;

  return (
    <Box flexDirection={'column'} marginTop={1} marginBottom={1}>
      <MetaData metaData={metaData} />
      <TaskResults taskResults={taskResults} rules={rules} logParser={logParser} />
      <RenderTiming timings={logParser.timings} />
      <CLIInfo metaData={metaData} />
    </Box>
  );
};

const MetaData: React.FC<{ metaData: CheckupMetadata }> = ({ metaData }) => {
  let { analyzedFilesCount, project } = metaData;
  let { name, version, repository } = project;
  let analyzedFilesMessage =
    repository.totalFiles !== analyzedFilesCount ? ` (${analyzedFilesCount} files analyzed)` : '';

  return (
    <>
      <Box flexDirection="column" marginBottom={1}>
        <Box marginBottom={1}>
          <Text>
            Checkup report generated for {name} v{version} {analyzedFilesMessage}
          </Text>
        </Box>
        <Box marginBottom={1}>
          <Text>
            This project is {repository.age} old, with {repository.activeDays} active days,{' '}
            {repository.totalCommits} commits and {repository.totalFiles} files
          </Text>
        </Box>
      </Box>
    </>
  );
};

const TaskResults: React.FC<{
  taskResults: Map<TaskName, RuleResults> | undefined;
  rules: ReportingDescriptor[];
  logParser: CheckupLogParser;
}> = ({ taskResults, rules, logParser }) => {
  let r: { Component: React.FC<any>; taskResult: RuleResults }[] = [];

  if (taskResults!.size > 0) {
    [...taskResults!.values()].forEach((taskResult) => {
      let taskProps = taskResult!.rule?.properties!;
      let componentName = taskProps.component.name;

      r.push({
        Component: registeredComponents.get(componentName ?? 'list')!,
        taskResult,
      });
    });

    // For any executed task, we want to set its values to empty for output, to indicate the task ran with no results.
    for (let rule of rules) {
      if (
        !r.some((item) => {
          return rule.id === item.taskResult.rule.id;
        }) &&
        logParser.executedTasks.some((ruleDescriptor) => ruleDescriptor.id === rule.id)
      ) {
        let taskProps = rule.properties;
        let componentName = taskProps!.component.name;

        r.push({
          Component: registeredComponents.get(componentName ?? 'list')!,
          taskResult: {
            results: [],
            rule: rule,
          },
        });
      }
    }

    return (
      <>
        <Box marginBottom={1}>
          <Text>Checkup ran the following task(s) successfully:</Text>
        </Box>
        {r.map(({ Component, taskResult }) => {
          return (
            <Box flexDirection="column" key={taskResult.rule.id}>
              <Component taskResult={taskResult} />
              <Newline />
            </Box>
          );
        })}
      </>
    );
  } else {
    return <Text></Text>;
  }
};

const RenderTiming: React.FC<{ timings: Record<string, number> }> = ({ timings }) => {
  let total = Object.values(timings).reduce((total, timing) => (total += timing), 0);
  let tableData: any[] = [];

  if (process.env.CHECKUP_TIMING !== '1') {
    return <></>;
  }

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

const CLIInfo: React.FC<{ metaData: CheckupMetadata }> = ({ metaData }) => {
  let { version, configHash } = metaData.cli;

  return (
    <Box flexDirection="column">
      <Text color={'grey'}>checkup v{version}</Text>
      <Text color={'grey'}>config {configHash}</Text>
    </Box>
  );
};

export default PrettyFormatter;
