import { BaseTaskResult, TaskResult, ui, ActionList, toPercent } from '@checkup/core';

import { Dependency } from '../tasks/outdated-dependencies-task';

export default class OutdatedDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  actionList!: ActionList;
  data!: {
    dependencies: Dependency[];
  };

  process(data: { dependencies: Dependency[] }) {
    this.data = data;

    this.actionList = new ActionList(
      [
        {
          name: 'percentage-major-outdated',
          threshold: 0.05,
          value: this.versionTypes.get('major')!.length / this.data.dependencies.length,
          get enabled() {
            return this.value > this.threshold;
          },
          get message() {
            return `${toPercent(
              this.value
            )} of your dependencies are major versions behind, this should be at most ${toPercent(
              this.threshold
            )}.`;
          },
        },
        {
          name: 'percentage-minor-outdated',
          threshold: 0.05,
          value: this.versionTypes.get('minor')!.length / this.data.dependencies.length,
          get enabled() {
            return this.value > this.threshold;
          },
          get message() {
            return `${toPercent(
              this.value
            )} of your dependencies are minor versions behind, this should be at most ${toPercent(
              this.threshold
            )}.`;
          },
        },
        {
          name: 'percentage-outdated',
          threshold: 0.2,
          value: this.outdatedDependencies.length / this.data.dependencies.length,
          get enabled() {
            return this.value > this.threshold;
          },
          get message() {
            return `${toPercent(
              this.value
            )} of your dependencies are outdated, this should be at most ${toPercent(
              this.threshold
            )}.`;
          },
        },
      ],
      this.config
    );
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
