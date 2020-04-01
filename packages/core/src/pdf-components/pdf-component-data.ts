import { TaskMetaData, ReportComponentType } from '../types';

export abstract class PdfComponentData {
  meta: TaskMetaData;
  componentType: ReportComponentType;

  constructor(meta: TaskMetaData, componentType: ReportComponentType) {
    this.meta = meta;
    this.componentType = componentType;
  }
}
