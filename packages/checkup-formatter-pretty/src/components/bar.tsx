import * as React from 'react';
import { RuleResults } from '@checkup/core';
import { BarData } from '../types';
import { Bar } from '../sub-components/sectioned-bar';

export const TaskResultBar: React.FC<{ taskResult: RuleResults }> = ({ taskResult }) => {
  let barData: BarData = {
    name: taskResult.rule.id,
    value: taskResult.results.length,
    total: taskResult.results.length,
  };
  return <Bar data={barData} />;
};
