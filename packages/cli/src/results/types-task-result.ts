import { TaskItemData, TaskResult } from '../types';

import { ui } from '../utils/ui';

export default class TypesTaskResult implements TaskResult {
  types!: TaskItemData[];

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
