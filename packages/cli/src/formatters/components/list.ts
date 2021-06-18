import { BaseOutputWriter } from '@checkup/core';
import { ReportingDescriptor, Result } from 'sarif';

type ListComponentOptions = {};

export default class ListComponent {
  name: string = 'list';

  constructor(private writer: BaseOutputWriter) {}

  render(rule: ReportingDescriptor, _results: Result[], _options?: ListComponentOptions) {
    // shape the data using the rule and results
    // this.writer.valuesList(values, unit, color);
    // this.writer.blankLine();

    this.writer.section(rule.properties?.taskDisplayName, () => {
      // TBD
    });
  }
}
