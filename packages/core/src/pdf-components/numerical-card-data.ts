import { TaskMetaData, Grade } from '../types';
import { PdfComponentData } from './pdf-component-data';

export default class NumericalCardData extends PdfComponentData {
  filePath = '/path/'; //TODO: @ckessler - use this to register the partial, instead of hardcoding the path in pdf.ts
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
    super(meta);
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
