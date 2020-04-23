import { PieChartData } from '@checkup/core';

interface PieChartDataToValidate {
  labels: string[];
  resultDescription: string;
  values: number[];
}

/*
 * Each pie chart will have a dynamic UUID that is required to render multiple charts on a page, preventing
 * tests from being able to validate against snapshots. This helper function filters out the data we dont
 * care about validating in our tests, so we can test the data being passed to the pie-chart is correct
 */
export function filterPieChartDataForTest(pieChartaData: PieChartData[]): PieChartDataToValidate[] {
  return pieChartaData.map((result) => {
    return {
      labels: result.labels,
      resultDescription: result.resultDescription,
      values: result.values,
    };
  });
}
