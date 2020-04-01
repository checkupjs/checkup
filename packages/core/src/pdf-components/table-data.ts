import { TaskMetaData, DependencyResult } from '../types';
import { PdfComponentData } from './pdf-component-data';

export default class TableData extends PdfComponentData {
  filePath = '/path/'; //TODO: @ckessler - use this to register the partial, instead of hardcoding the path in pdf.ts
  taskResult: DependencyResult[];

  constructor(meta: TaskMetaData, taskResult: DependencyResult[]) {
    super(meta);
    this.taskResult = taskResult;
  }
}
