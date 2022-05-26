import * as React from 'react';
import { RuleResults } from '@checkup/core';
import { BarData } from '../types';
import { SectionedBar } from '../sub-components/sectioned-bar.js';

/**
 * // TODO: Group result by data field
 * that provided by checkup task
 */
export const Bar: React.FC<{ taskResult: RuleResults }> = ({ taskResult }) => {
  let barData: BarData = {
    name: taskResult.rule.id,
    value: taskResult.results.length,
    total: taskResult.results.length,
  };
  return <SectionedBar data={barData} />;
};
