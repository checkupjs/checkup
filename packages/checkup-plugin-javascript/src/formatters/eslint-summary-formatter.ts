import { BaseOutputWriter, renderLintingSummaryResult } from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], writer: BaseOutputWriter) {
  renderLintingSummaryResult(taskResults, writer);
}
