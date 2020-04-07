import { TaskMetaData, Grade, DependencyResult, ReportComponentType } from '../types';
import { default as TableData } from './table-data';

export default class GradedTableData extends TableData {
  grade: Grade;

  constructor(meta: TaskMetaData, public taskResult: DependencyResult[]) {
    super(meta, ReportComponentType.GradedTable, taskResult);

    this.grade = this._deriveGrade();
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
