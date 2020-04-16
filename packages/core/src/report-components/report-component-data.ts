import { ReportComponentType, TaskMetaData } from '../types/tasks';

export abstract class ReportComponentData {
  constructor(public meta: TaskMetaData, public componentType: ReportComponentType) {}
}
