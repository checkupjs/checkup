import { ui } from '@checkup/core';
import BaseMetaTaskResult from '../base-meta-task-result';
import { MetaTaskResult } from '../types';
import { OutdatedDependency } from '../tasks/outdated-dependencies-task';

export default class OutdatedDependenciesTaskResult extends BaseMetaTaskResult
  implements MetaTaskResult {
  versionTypes!: Map<string, Array<OutdatedDependency>>;

  stdout() {
    ui.styledHeader(`${this.meta.friendlyTaskName} -- Overview`);
    ui.styledObject({
      Major: this.versionTypes.get('major')?.length,
      Minor: this.versionTypes.get('minor')?.length,
      Patch: this.versionTypes.get('patch')?.length,
    });
    ui.blankLine();

    if (this.versionTypes.get('major')?.length) {
      ui.styledHeader(`${this.meta.friendlyTaskName} -- Major`);
      this._writeToTable(this.versionTypes.get('major')!);
    }
    ui.blankLine();

    if (this.versionTypes.get('minor')?.length) {
      ui.styledHeader(`${this.meta.friendlyTaskName} -- Minor`);
      this._writeToTable(this.versionTypes.get('minor')!);
    }
    ui.blankLine();

    if (this.versionTypes.get('patch')?.length) {
      ui.styledHeader(`${this.meta.friendlyTaskName} -- Patch`);
      this._writeToTable(this.versionTypes.get('patch')!);
    }
    ui.blankLine();
  }

  json() {
    return {
      meta: this.meta,
      result: {},
    };
  }

  _writeToTable(dependencies: OutdatedDependency[]) {
    ui.table(dependencies, {
      package: {},
      current: {},
      wanted: {},
      latest: {},
      packageType: {},
      url: {},
    });
  }
}
