import { ITaskItemData, ITaskResult } from '../types';

import { ui } from '../utils/ui';

export default class TypesTaskResult implements ITaskResult {
  types!: ITaskItemData[];

  toConsole() {
    ui.styledHeader('Types');
    ui.blankLine();
    ui.table(this.types, { type: {}, total: {} });
    ui.blankLine();
  }

  toJson() {
    return { types: this.types };
  }
}
