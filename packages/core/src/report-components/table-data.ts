import { TaskMetaData, DependencyResult, ReportComponentType } from '../types';
import { ReportComponentData } from './report-component-data';

export default class TableData extends ReportComponentData {
  constructor(
    meta: TaskMetaData,
    reportComponentType: ReportComponentType = ReportComponentType.Table,
    public taskResult: DependencyResult[]
  ) {
    super(meta, reportComponentType);
  }
}
