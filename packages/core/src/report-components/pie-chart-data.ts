import { TaskMetaData, Grade, ReportComponentType, PieChartItem } from '../types/tasks';
import { ReportComponentData } from './report-component-data';

const COLORS = [
  '"#4FD1C5"', // teal400
  '"#7F9CF5"', // indigo400
  '"#FC8181"', // red400
  '"#63B3ED"', // blue400
  '"#B794F4"', // purple400
  '"#F687B3"', // pink400
  '"#F6E05E"', // yellow400
  '"#F6AD55"', // orange400
  '"#68D391"', // green400
];

export default class PieChartData extends ReportComponentData {
  grade: Grade;
  UUID: number;
  labels: Array<string>;
  values: Array<number>;
  backgroundColors: Array<string>;

  constructor(
    meta: TaskMetaData,
    pieSlices: PieChartItem[],
    public resultDescription: string,
    defaultUUID?: number
  ) {
    super(meta, ReportComponentType.PieChart);

    if (pieSlices.length > 9) {
      throw new Error('pie chart can only handle 9 slices');
    }
    this.grade = this._deriveGrade();
    this.UUID = defaultUUID || Math.floor(Math.random() * 100);
    this.labels = pieSlices.map((slice) => `"${slice.description}"`);
    this.values = pieSlices.map((slice) => slice.value);
    this.backgroundColors = COLORS.slice(0, pieSlices.length);
  }

  _deriveGrade() {
    // TODO: add calculation
    return Grade.A;
  }
}
