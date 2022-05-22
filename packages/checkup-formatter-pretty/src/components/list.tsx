import * as React from 'react';
import { Box, Text } from 'ink';
import { RuleResults } from '@checkup/core';
import * as objectPath from 'object-path';
import startCase from 'lodash.startcase';
import { TaskDisplayName } from '../sub-components/task-display-name.js';
import { getOptions } from '../get-options.js';

type ListOptions = {
  items: Record<string, { groupBy: string; value: string }>;
};

type ListItem = {
  text: string;
  value: string | number;
};

export const List: React.FC<{ taskResult: RuleResults }> = ({ taskResult }) => {
  let listItems = buildListData(taskResult);

  return (
    <>
      <TaskDisplayName taskResult={taskResult} />
      <Box marginLeft={2} flexDirection="column">
        {listItems.map((item: any) => {
          return (
            <Text key={item.text}>
              {startCase(item.text)} {item.value}
            </Text>
          );
        })}
      </Box>
    </>
  );
};

function buildListData(taskResult: RuleResults) {
  let { rule, results } = taskResult;
  let { items } = getOptions<ListOptions>(rule);
  let listItems: ListItem[] = [];

  for (let item of Object.keys(items)) {
    listItems.push({
      text: item,
      value: results.filter(
        (result) => objectPath.get(result, items[item].groupBy) === items[item].value
      ).length,
    });
  }

  return listItems;
}
