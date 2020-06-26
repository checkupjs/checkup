import { BaseTaskResult, TaskResult, ui } from '@checkup/core';

export default class EmberInRepoAddonEnginesTaskResult extends BaseTaskResult
  implements TaskResult {
  data: {
    inRepoAddons: string[];
    inRepoEngines: string[];
  } = { inRepoAddons: [], inRepoEngines: [] };

  process(data: { inRepoEngines: string[]; inRepoAddons: string[] }) {
    this.data = data;
  }

  toConsole() {
    if (this.data.inRepoAddons.length === 0 && this.data.inRepoEngines.length === 0) {
      return;
    }

    ui.section(this.meta.friendlyTaskName, () => {
      ui.log(`In-Repo Addons: ${this.data.inRepoAddons.length}`);
      ui.log(`In-Repo Engines: ${this.data.inRepoEngines.length}`);
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: {
        inRepoAddons: this.data.inRepoAddons,
        inRepoEngines: this.data.inRepoEngines,
      },
    };
  }
}
