import { TaskMetaData, Grade, ReportComponentType } from '../types';
import { PdfComponentData } from './pdf-component-data';

export default class PieChartData extends PdfComponentData {
  resultNumerator: number;
  resultDenominator: number;
  resultDescription: string;
  grade: Grade;

  constructor(
    meta: TaskMetaData,
    resultNumerator: number,
    resultDenominator: number,
    resultDescription: string
  ) {
    super(meta, ReportComponentType.PieChart);
    this.resultNumerator = resultNumerator;
    this.resultDenominator = resultDenominator;
    this.resultDescription = resultDescription;
    this.grade = this._deriveGrade();
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
