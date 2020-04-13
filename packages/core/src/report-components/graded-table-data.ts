import { DependencyResult, Grade, TaskMetaData } from '../types/tasks';

import { default as TableData } from './table-data';

export type GradeClass = {
  [key in Grade]: string;
};
const GRADE_CLASSES: GradeClass = {
  [Grade.A]: 'bg-green-600',
  [Grade.B]: 'bg-green-200',
  [Grade.C]: 'bg-yellow-400',
  [Grade.D]: 'bg-orange-500',
  [Grade.F]: 'bg-red-600',
};

export default class GradedTableData extends TableData {
  grade: Grade;

  constructor(meta: TaskMetaData, taskResult: DependencyResult[]) {
    taskResult.forEach(
      (result) => (result.gradeClass = result.grade ? GRADE_CLASSES[result.grade] : '')
    );
    const defaultTableHeaders = Object.keys(taskResult[0]).filter(
      (item) => item !== 'grade' && item !== 'gradeClass'
    );

    super(meta, taskResult, defaultTableHeaders);

    this.grade = this._deriveGrade();
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
