import { TaskMetaData } from '../types';

export abstract class PdfComponentData {
  meta: TaskMetaData;

  constructor(meta: TaskMetaData) {
    this.meta = meta;
  }
}
