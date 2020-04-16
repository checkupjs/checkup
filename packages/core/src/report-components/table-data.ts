import { DependencyResult, ReportComponentType, TaskMetaData, Grade } from '../types/tasks';

import { ReportComponentData } from './report-component-data';

export interface ResultToRender {
  result: DependencyResult;
  rowClass: string;
}

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

export default class TableData extends ReportComponentData {
  tableHeaders: Array<string>;
  resultsToRender: ResultToRender[];
  grade?: Grade;

  constructor(meta: TaskMetaData, resultData: DependencyResult[]) {
    super(meta, ReportComponentType.Table);

    this.resultsToRender = resultData.map(({ name, value, grade }) => ({
      result: { name, value },
      rowClass: grade ? GRADE_CLASSES[grade] : 'bg-gray-100',
    }));

    this.tableHeaders = this._deriveTableHeaders(resultData);

    if (this.containsGrades) {
      this.grade = this._deriveGrade();
    }
  }

  get containsGrades() {
    return this.resultsToRender[0].result.grade !== undefined;
  }

  _deriveTableHeaders(resultData: DependencyResult[]): Array<string> {
    return Object.keys(resultData[0]).filter((item) => item !== 'grade');
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
