import { Grade, ReportComponentType, TaskMetaData } from '../types/tasks';

import { ReportComponentData } from './report-component-data';

export default class PieChartData extends ReportComponentData {
  grade: Grade;

  constructor(
    meta: TaskMetaData,
    public resultNumerator: number,
    public resultDenominator: number,
    public resultDescription: string
  ) {
    super(meta, ReportComponentType.PieChart);
    this.grade = this._deriveGrade();
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
