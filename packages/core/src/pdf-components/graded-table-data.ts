import { TaskMetaData, Grade, DependencyResult, ReportComponentType } from '../types';
import { default as TableData } from './table-data';

export default class GradedTableData extends TableData {
  taskResult: DependencyResult[];
  grade: Grade;

  constructor(meta: TaskMetaData, taskResult: DependencyResult[]) {
    super(meta, taskResult, ReportComponentType.GradedTable);

    this.taskResult = taskResult;
    this.grade = this._deriveGrade();
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
