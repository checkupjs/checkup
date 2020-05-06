import { ESLintReport, derivePercentageString } from '@checkup/core';
import { TestTypeInfo, TestType } from '../types';

enum testCategories {
  skipUnit = 'skipUnit',
  todoUnit = 'todoUnit',
  onlyUnit = 'onlyUnit',
  testUnit = 'testUnit',
  skipRendering = 'skipRendering',
  todoRendering = 'todoRendering',
  onlyRendering = 'onlyRendering',
  testRendering = 'testRendering',
  skipApplication = 'skipApplication',
  todoApplication = 'todoApplication',
  onlyApplication = 'onlyApplication',
  testApplication = 'testApplication',
}

type testCategoriesCounts = {
  [key in testCategories]: number;
};

export function transformESLintReport(report: ESLintReport): TestTypeInfo[] {
  const eslintMessages = report.results.flatMap((report) =>
    report.messages.flatMap((message) => message.message)
  ) as testCategories[];

  const formattedCounts = eslintMessages.reduce(
    (acc: testCategoriesCounts, item: testCategories) => {
      acc[item]++;
      return acc;
    },
    {
      skipUnit: 0,
      todoUnit: 0,
      onlyUnit: 0,
      testUnit: 0,
      skipRendering: 0,
      todoRendering: 0,
      onlyRendering: 0,
      testRendering: 0,
      skipApplication: 0,
      todoApplication: 0,
      onlyApplication: 0,
      testApplication: 0,
    } as testCategoriesCounts
  );

  return [
    {
      type: TestType.Unit,
      total:
        formattedCounts.onlyUnit +
        formattedCounts.todoUnit +
        formattedCounts.skipUnit +
        formattedCounts.testUnit,
      onlys: formattedCounts.onlyUnit,
      todos: formattedCounts.todoUnit,
      skips: formattedCounts.skipUnit,
      tests: formattedCounts.testUnit,
      percentageSkipped: derivePercentageString(
        formattedCounts.skipUnit,
        formattedCounts.testUnit + formattedCounts.skipUnit
      ),
    },
    {
      type: TestType.Rendering,
      total:
        formattedCounts.onlyRendering +
        formattedCounts.todoRendering +
        formattedCounts.skipRendering +
        formattedCounts.testRendering,
      onlys: formattedCounts.onlyRendering,
      todos: formattedCounts.todoRendering,
      skips: formattedCounts.skipRendering,
      tests: formattedCounts.testRendering,
      percentageSkipped: derivePercentageString(
        formattedCounts.skipRendering,
        formattedCounts.testRendering + formattedCounts.skipRendering
      ),
    },
    {
      type: TestType.Application,
      total:
        formattedCounts.onlyApplication +
        formattedCounts.todoApplication +
        formattedCounts.skipApplication +
        formattedCounts.testApplication,
      onlys: formattedCounts.onlyApplication,
      todos: formattedCounts.todoApplication,
      skips: formattedCounts.skipApplication,
      tests: formattedCounts.testApplication,
      percentageSkipped: derivePercentageString(
        formattedCounts.skipApplication,
        formattedCounts.testApplication + formattedCounts.skipApplication
      ),
    },
  ];
}
