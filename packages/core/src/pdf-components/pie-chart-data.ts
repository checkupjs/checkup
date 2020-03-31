import { TaskMetaData, Grade } from '../types';
import { PdfComponentData } from './pdf-component-data';

export default class PieChartData extends PdfComponentData {
  filePath = '/path/'; //TODO: @ckessler - use this to register the partial, instead of hardcoding the path in pdf.ts
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
    super(meta);
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
