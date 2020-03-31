import { TaskMetaData, Grade, DependencyResult } from '../types';
import { default as TableData } from './table-data';

export default class GradedTableData extends TableData {
  filePath = '/path/'; //TODO: @ckessler - use this to register the partial, instead of hardcoding the path in pdf.ts
  taskResult: DependencyResult[];
  grade: Grade;

  constructor(meta: TaskMetaData, taskResult: DependencyResult[]) {
    super(meta, taskResult);

    this.taskResult = taskResult;
    this.grade = this._deriveGrade();
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
