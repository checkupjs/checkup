import { TableResult, ReportComponentType, TaskMetaData, Grade } from '../types/tasks';

import { ReportComponentData } from './report-component-data';

export interface FormattedResult {
  result: TableResult;
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
  formattedResult: FormattedResult[];
  grade?: Grade;

  constructor(meta: TaskMetaData, resultData: TableResult[]) {
    super(meta, ReportComponentType.Table);

    this.formattedResult = resultData.map(({ name, value, grade }) => ({
      result: { name, value },
      rowClass: grade ? GRADE_CLASSES[grade] : 'bg-gray-100',
    }));

    this.tableHeaders = this._deriveTableHeaders(resultData);

    if (this.containsGrades) {
      this.grade = this._deriveGrade();
    }
  }

  get containsGrades() {
    return this.formattedResult[0].result.grade !== undefined;
  }

  _deriveTableHeaders(resultData: TableResult[]): Array<string> {
    return Object.keys(resultData[0]).filter((item) => item !== 'grade');
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
