import { BaseTaskResult, TaskResult, ui } from '@checkup/core';
import { FileResults } from '../tasks/lines-of-code-task';

export default class LinesOfCodeTaskResult extends BaseTaskResult implements TaskResult {
  fileResults!: FileResults[];

  toConsole() {
    let resultsToPrint = this.fileResults.map((fileResult: FileResults) => {
      let reducedTotal = fileResult.results.reduce((acc, item) => {
        return acc + item.total;
      }, 0);

      let reducedTodo = fileResult.results.reduce((acc, item) => {
        return acc + item.todo;
      }, 0);

      return { total: reducedTotal, todo: reducedTodo, type: fileResult.fileExension };
    });

    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(resultsToPrint, {
        type: { header: 'File type', minWidth: 12 },
        total: { header: 'Total LOC', minWidth: 12 },
        todo: { header: 'Todos' },
      });
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: { fileResults: this.fileResults },
    };
  }
}
