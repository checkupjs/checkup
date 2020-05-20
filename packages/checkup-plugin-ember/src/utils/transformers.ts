import { TestType, TestTypeInfo } from '../types';

import { ESLintReport } from '@checkup/core';

enum TestCategories {
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

type TestCategoriesCounts = {
  [key in TestCategories]: number;
};

export function transformESLintReport(report: ESLintReport): TestTypeInfo[] {
  const eslintMessages = report.results.flatMap((report) =>
    report.messages.flatMap((message) => message.message)
  ) as TestCategories[];

  const formattedCounts = eslintMessages.reduce(
    (acc: TestCategoriesCounts, item: TestCategories) => {
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
    } as TestCategoriesCounts
  );

  return [
    {
      type: TestType.Unit,
      total:
        formattedCounts.onlyUnit +
        formattedCounts.todoUnit +
        formattedCounts.skipUnit +
        formattedCounts.testUnit,
      only: formattedCounts.onlyUnit,
      todo: formattedCounts.todoUnit,
      skip: formattedCounts.skipUnit,
      test: formattedCounts.testUnit,
    },
    {
      type: TestType.Rendering,
      total:
        formattedCounts.onlyRendering +
        formattedCounts.todoRendering +
        formattedCounts.skipRendering +
        formattedCounts.testRendering,
      only: formattedCounts.onlyRendering,
      todo: formattedCounts.todoRendering,
      skip: formattedCounts.skipRendering,
      test: formattedCounts.testRendering,
    },
    {
      type: TestType.Application,
      total:
        formattedCounts.onlyApplication +
        formattedCounts.todoApplication +
        formattedCounts.skipApplication +
        formattedCounts.testApplication,
      only: formattedCounts.onlyApplication,
      todo: formattedCounts.todoApplication,
      skip: formattedCounts.skipApplication,
      test: formattedCounts.testApplication,
    },
  ];
}
