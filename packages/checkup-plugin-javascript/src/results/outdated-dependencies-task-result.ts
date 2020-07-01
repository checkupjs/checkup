import { BaseTaskResult, TaskResult, ui, toPercent, ActionsEvaluator, Action } from '@checkup/core';

import { Dependency } from '../tasks/outdated-dependencies-task';

export default class OutdatedDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  actions: Action[] = [];
  data!: {
    dependencies: Dependency[];
  };

  process(data: { dependencies: Dependency[] }) {
    this.data = data;

    let actionsEvaluator = new ActionsEvaluator();

    actionsEvaluator.add({
      name: 'reduce-outdated-major-dependencies',
      summary: 'Update outdated major versions',
      details: `${this.versionTypes.get('major')!.length} major versions outdated`,
      defaultThreshold: 0.05,
      items: [],
      input: this.versionTypes.get('major')!.length / this.data.dependencies.length,
    });
    actionsEvaluator.add({
      name: 'reduce-outdated-minor-dependencies',
      summary: 'Update outdated minor versions',
      details: `${this.versionTypes.get('minor')!.length} minor versions outdated`,
      defaultThreshold: 0.05,
      items: [],
      input: this.versionTypes.get('minor')!.length / this.data.dependencies.length,
    });
    actionsEvaluator.add({
      name: 'reduce-outdated-dependencies',
      summary: 'Update outdated versions',
      details: `${toPercent(
        this.outdatedDependencies.length / this.data.dependencies.length
      )} of versions outdated`,
      defaultThreshold: 0.2,
      items: [],
      input: this.outdatedDependencies.length / this.data.dependencies.length,
    });

    this.actions = actionsEvaluator.evaluate(this.config);
  }

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.sectionedBar(
        [
          { title: 'major', count: this.versionTypes.get('major')!.length, color: 'red' },
          { title: 'minor', count: this.versionTypes.get('minor')!.length, color: 'orange' },
          { title: 'patch', count: this.versionTypes.get('patch')!.length, color: 'yellow' },
        ],
        this.data.dependencies.length
      );
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: {
        dependencies: this.outdatedDependencies,
      },
    };
  }

  get outdatedDependencies(): Dependency[] {
    // if a dependency is up to date, the `bump` field will be null
    return this.data.dependencies.filter((dependency) => dependency.bump !== null);
  }

  get versionTypes(): Map<string, Array<Dependency>> {
    let versionTypes: Map<string, Array<Dependency>> = new Map<string, Array<Dependency>>([
      ['major', []],
      ['minor', []],
      ['patch', []],
    ]);

    for (let dependency of this.outdatedDependencies) {
      try {
        // for catching when dependency version is 'exotic', which means yarn cannot detect for you whether the package has become outdated
        versionTypes.get(dependency.bump)?.push(dependency);
      } catch {
        // do nothing
      }
    }

    return versionTypes;
  }
}
