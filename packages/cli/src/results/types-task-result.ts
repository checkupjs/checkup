import { ITaskResult, IConsoleWriter, ITaskItemData } from '../types';
import getTaskItemTotals from '../utils/get-task-item-totals';

export default class TypesTaskResult implements ITaskResult {
  types!: ITaskItemData;

  toConsole(writer: IConsoleWriter) {
    writer.heading('Types');
    writer.table(['Type', 'Total Count'], getTaskItemTotals(this.types));
    writer.line();
  }

  toJson() {
    return { types: this.types };
  }
}
