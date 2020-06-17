import { TaskClassification, TaskResult } from '@checkup/core';

const DEFAULT_CATEGORIES: Record<string, number> = {
  metrics: 6,
  'best practices': 5,
  dependencies: 4,
  linting: 3,
  testing: 2,
  migrations: 1,
};

function getCategorySort(category: string): number {
  return DEFAULT_CATEGORIES[category] ?? -1;
}

export function taskResultComparator<T extends TaskResult>(first: T, second: T) {
  let {
    category: firstC,
    group: firstGroup = '',
  }: TaskClassification = first.meta.taskClassification;
  let {
    category: secondC,
    group: secondGroup = '',
  }: TaskClassification = second.meta.taskClassification;

  let firstCategory = getCategorySort(firstC);
  let secondCategory = getCategorySort(secondC);

  if (firstCategory === secondCategory) {
    // eslint-disable-next-line unicorn/no-nested-ternary
    return firstGroup > secondGroup ? -1 : firstGroup < secondGroup ? 1 : 0;
  } else {
    return firstCategory > secondCategory ? -1 : 1;
  }
}
