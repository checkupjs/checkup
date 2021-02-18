import { renderLintingSummaryResult } from '@checkup/core';
import { Result } from 'sarif';

export function report(taskResults: Result[]) {
  renderLintingSummaryResult(taskResults);
}
