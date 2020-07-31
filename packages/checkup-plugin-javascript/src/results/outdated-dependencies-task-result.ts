import {
  BaseTaskResult,
  TaskResult,
  toPercent,
  ActionsEvaluator,
  Action,
  MultiValueResult,
  ui,
} from '@checkup/core';

export default class OutdatedDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  actions: Action[] = [];
  data: MultiValueResult[] = [];

  process(data: MultiValueResult[]) {
    this.data = data;

    let { values: dependenciesCount, total: totalDependencies } = this.data[0].dataSummary;
    let outdatedCount = Object.values(dependenciesCount).reduce((total, count) => total + count, 0);
    let actionsEvaluator = new ActionsEvaluator();

    actionsEvaluator.add({
      name: 'reduce-outdated-major-dependencies',
      summary: 'Update outdated major versions',
      details: `${dependenciesCount.major} major versions outdated`,
      defaultThreshold: 0.05,
      items: [],
      input: dependenciesCount.major / totalDependencies,
    });
    actionsEvaluator.add({
      name: 'reduce-outdated-minor-dependencies',
      summary: 'Update outdated minor versions',
      details: `${dependenciesCount.minor} minor versions outdated`,
      defaultThreshold: 0.05,
      items: [],
      input: dependenciesCount.minor / totalDependencies,
    });
    actionsEvaluator.add({
      name: 'reduce-outdated-dependencies',
      summary: 'Update outdated versions',
      details: `${toPercent(outdatedCount / totalDependencies)} of versions outdated`,
      defaultThreshold: 0.2,
      items: [],
      input: outdatedCount / totalDependencies,
    });

    this.actions = actionsEvaluator.evaluate(this.config);
  }

  toConsole() {
    let { values: dependenciesCount, total: totalDependencies } = this.data[0].dataSummary;

    ui.section(this.meta.friendlyTaskName, () => {
      ui.sectionedBar(
        [
          { title: 'major', count: dependenciesCount.major },
          { title: 'minor', count: dependenciesCount.minor },
          { title: 'patch', count: dependenciesCount.patch },
        ],
        totalDependencies
      );
    });
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data,
    };
  }
}
