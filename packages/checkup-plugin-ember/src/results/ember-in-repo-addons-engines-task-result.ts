import { BaseTaskResult, TableData, TaskResult, ui } from '@checkup/core';

export default class EmberInRepoAddonEnginesTaskResult extends BaseTaskResult
  implements TaskResult {
  inRepoAddons!: string[];
  inRepoEngines!: string[];

  toConsole() {
    if (this.inRepoAddons.length === 0 && this.inRepoEngines.length === 0) {
      return;
    }

    ui.section(this.meta.friendlyTaskName, () => {
      ui.log(`In-Repo Addons: ${this.inRepoAddons.length}`);
      ui.log(`In-Repo Engines: ${this.inRepoEngines.length}`);
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: { inRepoAddons: this.inRepoAddons, inRepoEngines: this.inRepoEngines },
    };
  }

  toReportData() {
    return [
      new TableData(this.meta, [
        { name: 'In-Repo Addons', value: this.inRepoAddons.length },
        { name: 'In-Repo Engines', value: this.inRepoEngines.length },
      ]),
    ];
  }
}
