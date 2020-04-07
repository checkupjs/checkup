import { TaskMetaData, ReportComponentType } from '../types';

export abstract class ReportComponentData {
  constructor(public meta: TaskMetaData, public componentType: ReportComponentType) {}
}
