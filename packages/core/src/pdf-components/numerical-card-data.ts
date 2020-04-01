import { TaskMetaData, Grade, ReportComponentType } from '../types';
import { PdfComponentData } from './pdf-component-data';

export default class NumericalCardData extends PdfComponentData {
  taskResult: number;
  resultDescription: string;
  resultHelp: string;
  grade: Grade;

  constructor(
    meta: TaskMetaData,
    taskResult: number,
    resultDescription: string,
    resultHelp?: string
  ) {
    super(meta, ReportComponentType.NumericalCard);
    this.taskResult = taskResult;
    this.resultDescription = resultDescription;
    this.resultHelp = resultHelp || '';
    this.grade = this._deriveGrade();
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
