import * as React from 'react';
import { Box, Text, Newline } from 'ink';
import { CheckupLogParser, CheckupMetadata, TaskName, RuleResults } from '@checkup/core';
import { ReportingDescriptor } from 'sarif';
import { MetaData } from '../components/meta-data.js';
import { TaskTiming } from '../components/task-timing.js';
import { CLIInfo } from '../components/cli-info.js';
import { Actions } from '../components/actions.js';
import { registeredComponents } from '../component-provider.js';

const PrettyFormatter: React.FC<{ logParser: CheckupLogParser }> = ({ logParser }) => {
  let metaData: CheckupMetadata = logParser.metaData;
  let taskResults: Map<string, RuleResults> | undefined = logParser.resultsByRule;
  let rules = logParser.rules;

  return (
    <Box flexDirection={'column'} marginTop={1} marginBottom={1}>
      <MetaData metaData={metaData} />
      <TaskResults taskResults={taskResults} rules={rules} logParser={logParser} />
      <TaskTiming timings={logParser.timings} />
      <Actions actions={logParser.actions} />
      <CLIInfo metaData={metaData} />
    </Box>
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

export default PrettyFormatter;
