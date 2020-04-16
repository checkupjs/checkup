import { Grade, ReportComponentType, TaskMetaData } from '../types/tasks';

import { ReportComponentData } from './report-component-data';

export default class NumericalCardData extends ReportComponentData {
  grade: Grade;

  constructor(
    meta: TaskMetaData,
    public resultData: number,
    public resultDescription: string,
    public resultHelp?: string
  ) {
    super(meta, ReportComponentType.NumericalCard);
    this.grade = this._deriveGrade();
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
