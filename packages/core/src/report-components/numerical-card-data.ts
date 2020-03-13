import { TaskMetaData, Grade, ReportComponentType } from '../types';
import { ReportComponentData } from './report-component-data';

export default class NumericalCardData extends ReportComponentData {
  grade: Grade;

  constructor(
    meta: TaskMetaData,
    public taskResult: number,
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
