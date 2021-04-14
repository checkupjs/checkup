import { renderLintingSummaryResult } from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[]) {
  renderLintingSummaryResult(taskResults);
}
