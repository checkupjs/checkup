import { DependencyResult, Grade, ReportComponentType, TaskMetaData } from '../types/tasks';

import { default as TableData } from './table-data';

export default class GradedTableData extends TableData {
  grade: Grade;

  constructor(meta: TaskMetaData, public taskResult: DependencyResult[]) {
    super(meta, taskResult, ReportComponentType.GradedTable);

    this.grade = this._deriveGrade();
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
