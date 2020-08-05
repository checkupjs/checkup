import { BaseTaskResult, TaskResult, SummaryResult } from '@checkup/core';

export default class EmberDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  data!: SummaryResult[];

  process(data: SummaryResult[]) {
    this.data = data;
  }

  get hasDependencies() {
    return this.data.some((dependency) => dependency.count > 0);
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data,
    };
  }
}
