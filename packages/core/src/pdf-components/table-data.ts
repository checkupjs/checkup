import { TaskMetaData, DependencyResult, ReportComponentType } from '../types';
import { PdfComponentData } from './pdf-component-data';

export default class TableData extends PdfComponentData {
  taskResult: DependencyResult[];

  constructor(
    meta: TaskMetaData,
    taskResult: DependencyResult[],
    reportComponentType: ReportComponentType = ReportComponentType.Table
  ) {
    super(meta, reportComponentType);
    this.taskResult = taskResult;
  }
}
