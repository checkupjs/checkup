import { TaskMetaData } from '../types';

export abstract class PdfComponentData {
  meta: TaskMetaData;
  result: number;

  constructor(meta: TaskMetaData, result: number) {
    this.meta = meta;
    this.result = result;
  }
}
